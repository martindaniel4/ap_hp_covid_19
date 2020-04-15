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
} from './types'
import {
  HOSPITAL_CODES_MAP,
  ORBIS_NO_ROOM_CHAR,
  GLIMS_IS_PCR_POSITIVE_VALUE,
  PACS_RADIO_POSITIVE_VALUE,
  SIRIUS_RETENIR_LIGNE_POSITIVE_VALUE,
} from './constants'

export const processFiles = (files: FilesDataType): ProcessingResultsType => {
  const { orbis, glims, pacs, sirius, capacity } = files

  let warnings = {
    orbisWithNoRoom: [],
    siriusWithNoRoom: [],
    glimsRowsWithPCRNotValid: [],
    pacsRowsWithRadioNotValid: [],
  }

  getWarningsFromGlims(glims, warnings)
  getWarningsFromPacs(pacs, warnings)

  // REFORMAT ORBIS DATE IF IN EXCEL FORMAT
  if (typeof(orbis.data[0]["Date d'entrée du dossier"]) === "number") {
    orbis.data.forEach(patient => {
      patient["Date d'entrée du dossier"]=excelDateToJSDate(patient["Date d'entrée du dossier"])
    })
  }

  // CREATE MAPS
  const glimsByIPP: GlimsByIppType = _.groupBy(glims.data, glimsField => glimsField['ipp'])
  const pacsByIPP: PacsByIppType = _.groupBy(pacs.data, pacsField => pacsField['ipp'])
  const capacityMap: CapacityMapType = _.groupBy(capacity.data, capacityField => getCapacityMapKey(capacityField['hopital'], capacityField['service_covid']))
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

        const buildCapacityKey = getCapacityMapKey(hospital, serviceName)
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

//Note that this seems to work only for Excel spreadsheets made on PC.
//Dates are stored as numbers in Excel and count the number of days since January 0, 1900
//(1900 standard, for mac it is 1904, which means January 0, 1904 is the start date).
function excelDateToJSDate(serial: number): Object {
   var utc_days  = Math.floor(serial - 25569)
   var utc_value = utc_days * 86400
   var date_info = new Date(utc_value * 1000)
   var fractional_day = serial - Math.floor(serial) + 0.0000001
   var total_seconds = Math.floor(86400 * fractional_day)
   var seconds = total_seconds % 60
   total_seconds -= seconds
   var hours = Math.floor(total_seconds / (60 * 60))
   var minutes = Math.floor(total_seconds / 60) % 60
   return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds)
}

function getSiriusMapKey(siriusField: SiriusFieldType): string {
  return trimStringUpperCase(siriusField['Code Chambre'] + '-' + siriusField['Libelle Chambre'])
}

function getCapacityMapKey(hopital: string, service_covid: string): string {
  return (hopital + ' - ' + service_covid).trim()
}

function getLastAdmitedPatientDate(patients: PatientType[]): string {
  const dateKey = "Date d'entrée du dossier"
  const lastDate = _.max(patients, patient => moment(patient[dateKey], 'DD/MM/YYYY hh:mm').valueOf() )[dateKey]
  return moment(lastDate, 'DD/MM/YYYY hh:mm').format('LLL')
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
    const isRadio = !!findPatientInPacs && isPacsRadioFieldOne(findPatientInPacs[0]['radio'])
    const isCovid = isPCR || isRadio

    const chambre = trimStringUpperCase(patient['Chambre'])
    if (chambre === ORBIS_NO_ROOM_CHAR) warnings['orbisWithNoRoom'].push(patient)
    const siriusRowForRoom = siriusByChambre[chambre] && siriusByChambre[chambre][0]
    if (!siriusRowForRoom) warnings['siriusWithNoRoom'].push(patient)

    const hospitalCode = siriusRowForRoom && siriusRowForRoom['Hopital']
    const hospitalXYZ = hospitalCode ? HOSPITAL_CODES_MAP[hospitalCode] : ''
    
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
  const pacsRowsWithRadioNotValid = pacs.data.filter(row => !isPacsRadioFieldOne(row['radio']))
  warnings['pacsRowsWithRadioNotValid'] = warnings['pacsRowsWithRadioNotValid'].concat(pacsRowsWithRadioNotValid)
}

function isPacsRadioFieldOne(field: number | string) {
  return (field === PACS_RADIO_POSITIVE_VALUE) || (field === PACS_RADIO_POSITIVE_VALUE.toString())
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