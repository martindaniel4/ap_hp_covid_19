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
  SiriusFieldType,
  BreakdownPerHospitalType,
  ServiceDataType,
  WarningsType,
  GlimsType,
  PacsType,
} from '../lib/types'
import {
  HOSPITAL_CODES_MAP,
  ORBIS_NO_ROOM_CHAR,
  GLIMS_IS_PCR_POSITIVE_VALUE,
  PACS_RADIO_POSITIVE_VALUE,
  SIRIUS_RETENIR_LIGNE_POSITIVE_VALUE,
  OBSTETRIC_SERVICES,
} from '../lib/constants'
import {
  formatOrbisDate
} from '../utils/date-utils'

export const processFiles = (files: FilesDataType): ProcessingResultsType => {
  const { orbis, glims, pacs, sirius, capacity } = files

  let warnings = {
    orbisWithNoRoom: [],
    orbisIsNewBorn: [],
    siriusWithNoRoom: [],
    glimsRowsWithPCRNotValid: [],
    pacsRowsWithRadioNotValid: [],
  }

  getWarningsFromGlims(glims, warnings)
  getWarningsFromPacs(pacs, warnings)

  // CREATE MAPS
  const glimsByIPP: GlimsByIppType = _.groupBy(glims.data, glimsField => glimsField['ipp'])
  const pacsByIPP: PacsByIppType = _.groupBy(pacs.data, pacsField => pacsField['ipp'])
  const capacityMap: CapacityMapType = _.groupBy(capacity.data, capacityField => getCapacityMapKey(capacityField['hopital'], capacityField['service_covid']))
  const siriusByChambre: SiriusByChambreType = _.groupBy(
    sirius.data.filter(row => row['Retenir ligne O/N'] === SIRIUS_RETENIR_LIGNE_POSITIVE_VALUE),
    siriusField => getSiriusMapKey(siriusField)
  )
  
  // PATIENTS LIST
  const allPatients: PatientType[] = extendOrbis(orbis, glimsByIPP, pacsByIPP, siriusByChambre, warnings).filter(p => p.isNewBorn === false)
  const allPatientsCovid: PatientType[] = allPatients.filter(p => p.isCovid)
  
  // BREAKDOWN PER HOSPITAL
  const patientsByHospital = _.groupBy(allPatients, p => p.hospitalXYZ)
  const breakdownPerHospital: BreakdownPerHospitalType = {}

  Object.keys(patientsByHospital)
    .forEach(hospitalXYZ => {
      const patientsForHospital = patientsByHospital[hospitalXYZ]
      const patientsByService = _.groupBy(patientsForHospital, p => p.siteCriseCovidFromSirius)
      const patientsCovidForHospital = patientsForHospital.filter(p => p.isCovid)

      const serviceData: ServiceDataType[] = []
      Object.keys(patientsByService).forEach(serviceName => {
        const patientsInService = patientsByService[serviceName]
        const patientsInServiceCovid = patientsInService.filter(p => p.isCovid)
        const patientsInServicePCR = patientsInService.filter(p => p.isPCR)
        const patientsInServiceRadio = patientsInService.filter(p => p.isRadio)

        const buildCapacityKey = getCapacityMapKey(hospitalXYZ, serviceName)
        const capacityTotal = capacityMap[buildCapacityKey] && capacityMap[buildCapacityKey][0]['lits_ouverts']
        const capacityCovid = capacityMap[buildCapacityKey] && capacityMap[buildCapacityKey][0]['lits_ouverts_covid']
        const localisation = patientsInService[0]['localisationCDGFromSirius']
      
        serviceData.push({
          hospitalXYZ,
          serviceName,
          localisation,
          patientsCount: patientsInService.length,
          patientsCountCovid: patientsInServiceCovid.length,
          patientsCountPCR: patientsInServicePCR.length,
          patientsCountRadio: patientsInServiceRadio.length,
          capacityTotal,
          capacityCovid,
          openBeds: capacityTotal - patientsInService.length,
        })
      })

      breakdownPerHospital[hospitalXYZ] = {
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

function extendOrbis(
  orbis: OrbisType,
  glimsByIPP: GlimsByIppType,
  pacsByIPP: PacsByIppType,
  siriusByChambre: SiriusByChambreType,
  warnings: WarningsType,
): PatientType[] {
  return orbis.data.map(orbisRow => {
    const entryDate = formatOrbisDate(orbisRow["Date d'entrée du dossier"])
    const birthDate = formatOrbisDate(orbisRow["Né(e) le"])
    const findPatientInGlims = glimsByIPP[orbisRow['IPP']]
    const findPatientInPacs = pacsByIPP[orbisRow['IPP']]

    const isPCR = !!findPatientInGlims && findPatientInGlims[0]['is_pcr'] === GLIMS_IS_PCR_POSITIVE_VALUE
    const isRadio = !!findPatientInPacs && isPacsRadioFieldOne(findPatientInPacs[0]['radio'])
    const isCovid = isPCR || isRadio
    const isObstetricService = _.contains(OBSTETRIC_SERVICES, orbisRow['U.Responsabilité'])
    const isNewBorn = isObstetricService && (moment(birthDate, "DD/MM/YYYY").year() === moment().year())
    if (isNewBorn) warnings['orbisIsNewBorn'].push(orbisRow)
    
    const chambre = trimStringUpperCase(orbisRow['Chambre'])
    if (chambre === ORBIS_NO_ROOM_CHAR) warnings['orbisWithNoRoom'].push(orbisRow)
    const siriusRowForRoom = siriusByChambre[chambre] && siriusByChambre[chambre][0]
    if ((!siriusRowForRoom) && (chambre != ORBIS_NO_ROOM_CHAR)) warnings['siriusWithNoRoom'].push(orbisRow)

    const hospitalCodeFromSirius = siriusRowForRoom && siriusRowForRoom['Hopital']
    const hospitalXYZ = hospitalCodeFromSirius ? HOSPITAL_CODES_MAP[hospitalCodeFromSirius] : ''

    return {
      entryDate,
      isCovid,
      isPCR,
      isRadio,
      isNewBorn,
      hospitalXYZ,
      siteCriseCovidFromSirius: siriusRowForRoom && siriusRowForRoom['Intitulé Site Crise COVID'],
      localisationCDGFromSirius: siriusRowForRoom && siriusRowForRoom['Localisation'],
    }
  })
}

function trimStringUpperCase(abc: string): string {
  return abc.toString().replace(/\s/g,'').toUpperCase()
}

function getSiriusMapKey(siriusField: SiriusFieldType): string {
  return trimStringUpperCase(siriusField['Code Chambre'] + '-' + siriusField['Libelle Chambre'])
}

function getCapacityMapKey(hopital: string, service_covid: string): string {
  return (hopital + ' - ' + service_covid).trim()
}

function getLastAdmitedPatientDate(patients: PatientType[]): string {
  const lastDate = _.max(patients, patient => moment(patient.entryDate, 'DD/MM/YYYY hh:mm').valueOf() ).entryDate
  return moment(lastDate, 'DD/MM/YYYY hh:mm').format('LLL')
}

function getWarningsFromGlims(glims: GlimsType, warnings: WarningsType): void {
  const glimsRowsWithPCRNotValid = glims.data.filter(row => row['is_pcr'] !== GLIMS_IS_PCR_POSITIVE_VALUE)
  warnings['glimsRowsWithPCRNotValid'] = warnings['glimsRowsWithPCRNotValid'].concat(glimsRowsWithPCRNotValid)
}

function getWarningsFromPacs(pacs: PacsType, warnings: WarningsType): void {
  const pacsRowsWithRadioNotValid = pacs.data.filter(row => !isPacsRadioFieldOne(row['radio']))
  warnings['pacsRowsWithRadioNotValid'] = warnings['pacsRowsWithRadioNotValid'].concat(pacsRowsWithRadioNotValid)
}

function isPacsRadioFieldOne(field: number | string) {
  return (field === PACS_RADIO_POSITIVE_VALUE) || (field === PACS_RADIO_POSITIVE_VALUE.toString())
}

function getPatientsCountPerDay(patients: PatientType[]): PatientsCountPerDayType {
  const patientsCountPerDay = _.countBy(patients, patient => moment(patient.entryDate, 'DD/MM/YYYY hh:mm').format('DD/MM/YYYY') )
  const sortedDays = _.sortBy(Object.keys(patientsCountPerDay), date => moment(date, 'DD/MM/YYYY').valueOf())

  return sortedDays.reduce((acc: PatientsCountPerDayType, date: string) => {
    acc.push({
      x0: moment(date, 'DD/MM/YYYY').toDate(),
      x: moment(date, 'DD/MM/YYYY').add(12,'hours').toDate(),
      y: patientsCountPerDay[date]
    })
    return acc
  }, [])
}