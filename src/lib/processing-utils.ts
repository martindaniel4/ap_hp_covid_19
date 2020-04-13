import _ from 'underscore'
import moment from 'moment'
import { FilesDataType, OrbisType, PatientType, GlimsByIppType, SiriusByCodeChambreType, PacsByIppType, ProcessingResultsType, PatientsCountPerDayType } from './types'
import { HOSPITAL_CODES_MAP } from './constants'

export const processFiles = (files: FilesDataType): ProcessingResultsType => {
  const { orbis, glims, pacs, sirius, capacity } = files

  const glimsByIPP: GlimsByIppType = _.groupBy(glims.data, p => p['ipp'])
  const pacsByIPP: PacsByIppType = _.groupBy(pacs.data, p => p['ipp'])
  const capacityMap: any = _.groupBy(capacity.data, row => (row['hopital'] + ' - ' + row['service_covid']).trim() )
  const siriusFiltered = sirius.data.filter(row => row['Retenir ligne O/N'] === "OUI")
  const siriusByCodeChambre: SiriusByCodeChambreType = _.groupBy(siriusFiltered, c => c['Code Chambre'])
  // console.log(siriusByCodeChambre)

  const allPatients = joinOrbisWithOtherFiles(orbis, glimsByIPP, pacsByIPP, siriusByCodeChambre)
  const allPatientsCovid = allPatients.filter(p => p.isCovid)
  
  const patientsByHospital = _.groupBy(allPatients, p => p.hospitalXYZ)

  // console.log(patientsByHospital)
  
  const breakdownPerHospital: any = {}
  Object.keys(patientsByHospital)
    .forEach(hospital => {
      const patientsForHospital = patientsByHospital[hospital]
      const patientsByService = _.groupBy(patientsForHospital, p => p.siteCriseCovidFromSirius)
      const patientsCovidForHospital = patientsForHospital.filter(p => p.isCovid)

      const newPatientsGroupedByService: any[] = []
      Object.keys(patientsByService).forEach(service => {
        const patientsInService = patientsByService[service]
        const patientsInServiceCovid = patientsInService.filter(p => p.isCovid)
        const patientsInServicePCR = patientsInService.filter(p => p.isPCR)
        const patientsInServiceRadio = patientsInService.filter(p => p.isRadio)

        const buildCapacityKey = (hospital + ' - ' + service).trim()
        const capacityTotal = capacityMap[buildCapacityKey] && capacityMap[buildCapacityKey][0]['lits_ouverts']
        const capacityCovid = capacityMap[buildCapacityKey] && capacityMap[buildCapacityKey][0]['lits_ouverts_covid']
        
        newPatientsGroupedByService.push({
          service,
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
        byService: newPatientsGroupedByService,
      }
    })
    
  return {
    patientsCountCovid: allPatientsCovid.length,
    lastPatientAdmittedOn: getLastAdmitedPatientDate(allPatientsCovid),
    patientsCountPerDay: getPatientsCountPerDay(allPatientsCovid),
    breakdownPerHospital
  }
}

// =============================================
// "PRIVATE" UTILS
// =============================================

function getHospitalKey(orbisHospitalString: string): string {
  return orbisHospitalString.split('- ')[1].slice(0,3)
}

function getLastAdmitedPatientDate(patients: PatientType[]): string {
  const dateKey = "Date d'entrée du dossier"
  const lastDate = _.max(patients, patient => moment(patient[dateKey], 'DD/MM/YYYY hh:mm').valueOf() )[dateKey]
  return moment(lastDate, 'DD/MM/YYYY hh:mm').format('Do MMMM YYYY à HH:mm')
}

function joinOrbisWithOtherFiles(
  orbis: OrbisType,
  glimsByIPP: GlimsByIppType,
  pacsByIPP: PacsByIppType,
  siriusByCodeChambre: SiriusByCodeChambreType,
) {
  return orbis.data.map(patient => {
    const findPatientInGlims = glimsByIPP[patient['IPP']]
    const findPatientInPacs = pacsByIPP[patient['IPP']]

    const isPCR = !!findPatientInGlims && findPatientInGlims[0]['is_pcr'] === "Positif"
    const isRadio = !!findPatientInPacs && findPatientInPacs[0]['radio'] === '1'
    const isCovid = isPCR || isRadio
    const covidSource = isPCR ? 'glims' : isRadio ? 'pacs' : null

    const chambre = patient['Chambre']
    const roomCode = chambre === '-' ? null : chambre.split(' ')[0]
    const siriusRowForRoomCode = siriusByCodeChambre[roomCode] && siriusByCodeChambre[roomCode][0]

    if (!siriusRowForRoomCode) {
      console.log(patient['U.Responsabilité'])
      console.log(chambre)
      console.log('-------------------')
    }

    const hospitalCode = siriusRowForRoomCode && siriusRowForRoomCode['Hopital']
    const hospitalXYZ = hospitalCode ? HOSPITAL_CODES_MAP[hospitalCode] : '';
    
    return {
      ...patient,
      isCovid,
      isPCR,
      isRadio,
      covidSource,
      hospitalXYZ,
      siteCriseCovidFromSirius: siriusRowForRoomCode && siriusRowForRoomCode['Intitulé Site Crise COVID'],
      localisationCDGFromSirius: siriusRowForRoomCode && siriusRowForRoomCode['Localisation CDG'],
    }
  })
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