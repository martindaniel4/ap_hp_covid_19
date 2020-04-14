import _ from 'underscore'
import moment from 'moment'
import {
  FilesDataType,
  OrbisType,
  PatientType,
  GlimsByIppType,
  SiriusByChambreType,
  PacsByIppType,
  ProcessingResultsType,
  PatientsCountPerDayType,
  CapacityMapType,
  CapacityFieldType,
  SiriusFieldType,
  BreakdownPerHospitalType,
  ServiceDataType,
  WarningsType,
  GlimsType,
  PacsType,
} from './types'
import {
  HOSPITAL_CODES_MAP,
  GLIMS_IS_PCR_POSITIVE_VALUE,
  PACS_RADIO_POSITIVE_VALUE,
  SIRIUS_RETENIR_LIGNE_POSITIVE_VALUE,
} from './constants'

export const processFiles = (files: FilesDataType): ProcessingResultsType => {
  const { orbis, glims, pacs, sirius, capacity } = files

  let warnings = {
    patientsWithNoRoom: [],
    glimsRowsWithPCRNotValid: [],
    pacsRowsWithRadioNotValid: [],
  }

  getWarningsFromGlims(glims, warnings)
  getWarningsFromPacs(pacs, warnings)

  // CREATE MAPS
  const glimsByIPP: GlimsByIppType = _.groupBy(glims.data, glimsField => glimsField['ipp'])
  const pacsByIPP: PacsByIppType = _.groupBy(pacs.data, pacsField => pacsField['ipp'])
  const capacityMap: CapacityMapType = _.groupBy(capacity.data, capacityField => getCapacityMapKey(capacityField))
  const siriusByChambre: SiriusByChambreType = _.groupBy(
    sirius.data.filter(row => row['Retenir ligne O/N'] === SIRIUS_RETENIR_LIGNE_POSITIVE_VALUE),
    siriusField => getSiriusMapKey(siriusField)
  )
  
  // PATIENTS LIST
  const allPatients: PatientType[] = extendOrbis(orbis, glimsByIPP, pacsByIPP, siriusByChambre, warnings)
  const allPatientsCovid: PatientType[] = allPatients.filter(p => p.isCovid)
  
  // BREAKDOWN PER HOSPITAL
  const patientsByHospital = _.groupBy(allPatients, p => p.hospitalXYZ)
  const breakdownPerHospital: BreakdownPerHospitalType = {}

  Object.keys(patientsByHospital)
    .forEach(hospital => {
      const patientsForHospital = patientsByHospital[hospital]
      const patientsByService = _.groupBy(patientsForHospital, p => p.siteCriseCovidFromSirius)
      const patientsCovidForHospital = patientsForHospital.filter(p => p.isCovid)

      const serviceData: ServiceDataType[] = []
      Object.keys(patientsByService).forEach(serviceName => {
        const patientsInService = patientsByService[serviceName]
        const patientsInServiceCovid = patientsInService.filter(p => p.isCovid)
        const patientsInServicePCR = patientsInService.filter(p => p.isPCR)
        const patientsInServiceRadio = patientsInService.filter(p => p.isRadio)

        const buildCapacityKey = (hospital + ' - ' + serviceName).trim()
        const capacityTotal = capacityMap[buildCapacityKey] && capacityMap[buildCapacityKey][0]['lits_ouverts']
        const capacityCovid = capacityMap[buildCapacityKey] && capacityMap[buildCapacityKey][0]['lits_ouverts_covid']
        
        serviceData.push({
          serviceName,
          patientsCount: patientsInService.length,
          patientsCountCovid: patientsInServiceCovid.length,
          patientsCountPCR: patientsInServicePCR.length,
          patientsCountRadio: patientsInServiceRadio.length,
          capacityTotal,
          capacityCovid,
          openBeds: capacityTotal - patientsInService.length,
        })
      })

      breakdownPerHospital[hospital] = {
        lastPatientAdmittedOn: getLastAdmitedPatientDate(patientsCovidForHospital),
        patientsCountCovid: patientsCovidForHospital.length,
        patientsCountPerDay: getPatientsCountPerDay(patientsCovidForHospital),
        byService: serviceData,
      }
    })
    
  return {
    patientsCountCovid: allPatientsCovid.length,
    lastPatientAdmittedOn: getLastAdmitedPatientDate(allPatientsCovid),
    patientsCountPerDay: getPatientsCountPerDay(allPatientsCovid),
    breakdownPerHospital,
    warnings,
  }
}

// =============================================
// "PRIVATE" UTILS
// =============================================

function trimStringUpperCase(abc: string): string {
  return abc.toString().replace(/\s/g,'').toUpperCase()
}

function getSiriusMapKey(siriusField: SiriusFieldType): string {
  return trimStringUpperCase(siriusField['Code Chambre'] + '-' + siriusField['Libelle Chambre'])
}

function getCapacityMapKey(capacityField: CapacityFieldType): string {
  return (capacityField['hopital'] + ' - ' + capacityField['service_covid']).trim()
}

function getLastAdmitedPatientDate(patients: PatientType[]): string {
  const dateKey = "Date d'entrée du dossier"
  const lastDate = _.max(patients, patient => moment(patient[dateKey], 'DD/MM/YYYY hh:mm').valueOf() )[dateKey]
  return moment(lastDate, 'DD/MM/YYYY hh:mm').format('Do MMMM YYYY à HH:mm')
}

function extendOrbis(
  orbis: OrbisType,
  glimsByIPP: GlimsByIppType,
  pacsByIPP: PacsByIppType,
  siriusByChambre: SiriusByChambreType,
  warnings: WarningsType,
) {
  return orbis.data.map(patient => {
    const findPatientInGlims = glimsByIPP[patient['IPP']]
    const findPatientInPacs = pacsByIPP[patient['IPP']]

    const isPCR = !!findPatientInGlims && findPatientInGlims[0]['is_pcr'] === GLIMS_IS_PCR_POSITIVE_VALUE
    const isRadio = !!findPatientInPacs && findPatientInPacs[0]['radio'] === PACS_RADIO_POSITIVE_VALUE
    const isCovid = isPCR || isRadio

    const chambre = trimStringUpperCase(patient['Chambre'])
    const siriusRowForRoom = siriusByChambre[chambre] && siriusByChambre[chambre][0]

    if (!siriusRowForRoom) warnings['patientsWithNoRoom'].push(patient)

    const hospitalCode = siriusRowForRoom && siriusRowForRoom['Hopital']
    const hospitalXYZ = hospitalCode ? HOSPITAL_CODES_MAP[hospitalCode] : '';
    
    return {
      ...patient,
      isCovid,
      isPCR,
      isRadio,
      hospitalXYZ,
      siteCriseCovidFromSirius: siriusRowForRoom && siriusRowForRoom['Intitulé Site Crise COVID'],
      localisationCDGFromSirius: siriusRowForRoom && siriusRowForRoom['Localisation CDG'],
    }
  })
}

function getWarningsFromGlims(glims: GlimsType, warnings: WarningsType): void {
  const glimsRowsWithPCRNotValid = glims.data.filter(row => row['is_pcr'] !== GLIMS_IS_PCR_POSITIVE_VALUE)
  warnings['glimsRowsWithPCRNotValid'] = warnings['glimsRowsWithPCRNotValid'].concat(glimsRowsWithPCRNotValid)
}

function getWarningsFromPacs(pacs: PacsType, warnings: WarningsType): void {
  const pacsRowsWithRadioNotValid = pacs.data.filter(row => row['radio'] !== PACS_RADIO_POSITIVE_VALUE)
  warnings['pacsRowsWithRadioNotValid'] = warnings['pacsRowsWithRadioNotValid'].concat(pacsRowsWithRadioNotValid)
}

function getPatientsCountPerDay(patients: PatientType[]): PatientsCountPerDayType {
  const patientsCountPerDay = _.countBy(patients, patient => moment(patient["Date d'entrée du dossier"], 'DD/MM/YYYY').format('DD/MM/YYYY') )
  const sortedDays = _.sortBy(Object.keys(patientsCountPerDay), date => moment(date, 'DD/MM/YYYY').format('X'))

  return sortedDays.reduce((acc: PatientsCountPerDayType, date: string) => {
    acc.push({
      x: date,
      y: patientsCountPerDay[date]
    })
    return acc
  }, [])
}