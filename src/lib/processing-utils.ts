import _ from 'underscore'
import moment from 'moment'
import { FilesDataType, OrbisType, PatientType, GlimsByIppType, CorrespondanceByCodeChambreType, PacsByIppType, ProcessingResultsType, PatientsCountPerDayType } from './types'
import { HOSPITAL_CODES_MAP } from './constants'

export const processFiles = (files: FilesDataType): ProcessingResultsType => {
  const { orbis, glims, pacs, correspondance, capacity } = files

  const glimsByIPP: GlimsByIppType = _.groupBy(glims.data, p => p['ipp'])
  const pacsByIPP: PacsByIppType = _.groupBy(pacs.data, p => p['ipp'])
  const capacityMap: any = _.groupBy(capacity.data, row => (row['hopital'] + ' - ' + row['service_covid']).trim() )
  const correspondanceByCodeChambre: CorrespondanceByCodeChambreType = _.groupBy(correspondance.data, c => c['Code Chambre'])

  const allPatients = joinOrbisWithOtherFiles(orbis, glimsByIPP, pacsByIPP, correspondanceByCodeChambre)
  const allPatientsCovid = allPatients.filter(p => p.isCovid)
  
  const patientsByHospital = _.groupBy(allPatients, p => p.hospitalXYZ)

  console.log(patientsByHospital)
  
  const breakdownPerHospital: any = {}
  Object.keys(patientsByHospital)
    .forEach(hospital => {
      const patientsForHospital = patientsByHospital[hospital]
      const patientsByService = _.groupBy(patientsForHospital, p => p.siteCriseCovidFromCorrespondance)
      const patientsCovidForHospital = patientsForHospital.filter(p => p.isCovid)

      const newPatientsGroupedByService: any[] = []
      Object.keys(patientsByService).forEach(service => {
        const patientsInService = patientsByService[service]
        const patientsInServiceCovid = patientsInService.filter(p => p.isCovid)

        const buildCapacityKey = (hospital + ' - ' + service).trim()
        const capacityCovid = capacityMap[buildCapacityKey] && capacityMap[buildCapacityKey][0]['lits_ouverts_covid']
        
        newPatientsGroupedByService.push({
          service,
          patientsCountCovid: patientsInServiceCovid.length,
          capacityCovid,
          openBeds: capacityCovid - patientsInServiceCovid.length,
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
  correspondanceByCodeChambre: CorrespondanceByCodeChambreType,
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
    const correspondanceRowForRoomCode = correspondanceByCodeChambre[roomCode] && correspondanceByCodeChambre[roomCode][0]

    if (!correspondanceRowForRoomCode) {
      console.log(getHospitalKey(patient['U.ResponsabilitÈ']))
      console.log(chambre)
      console.log('-------------------')
    }

    const hospitalCode = correspondanceRowForRoomCode && correspondanceRowForRoomCode['Hopital']
    const hospitalXYZ = hospitalCode ? HOSPITAL_CODES_MAP[hospitalCode] : '';
    
    return {
      ...patient,
      isCovid,
      covidSource,
      hospitalXYZ,
      siteCriseCovidFromCorrespondance: correspondanceRowForRoomCode && correspondanceRowForRoomCode['Intitulé Site Crise COVID'],
      localisationCDGFromCorrespondance: correspondanceRowForRoomCode && correspondanceRowForRoomCode['Localisation CDG'],
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