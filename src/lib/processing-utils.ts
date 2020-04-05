import _ from 'underscore'
import moment from 'moment'
import { FilesDataType, OrbisType, PatientType, GlimsByIppType, ProcessingResultsType, PatientsCountPerDayType } from './types'

export const processFiles = (files: FilesDataType): ProcessingResultsType => {
  const { orbis, glims } = files

  const glimsByIPP: GlimsByIppType = _.groupBy(glims.data, p => p['ipp'])

  const allPatients = extendOrbisWithGlims(orbis, glimsByIPP)
  const allPatientsPCR = allPatients.filter(p => p.isPCR)
  const patientsByHospital = _.groupBy(allPatients, p => getHospitalKey(p['U.ResponsabilitÈ']))
  
  const breakdownPerHospital: any = {}
  Object.keys(patientsByHospital)
    .forEach(hospital => {
      const patientsForHospital = patientsByHospital[hospital]
      const patientsByService = _.groupBy(patientsForHospital, p => p['U.Soins'].split(hospital)[1].trim())
      const patientsPCRForHospital = patientsForHospital.filter(p => p.isPCR)

      const newPatientsGroupedByService: any[] = []
      Object.keys(patientsByService).forEach(service => {
        const patientsInService = patientsByService[service]
        const patientsInServicePCR = patientsInService.filter(p => p.isPCR)
        const pcrRatio = `${Math.floor((patientsInServicePCR.length / patientsInService.length) * 100)}%`
        
        newPatientsGroupedByService.push({
          service,
          patientsCount: patientsInService.length,
          patientsCountPCR: patientsInServicePCR.length,
          pcrRatio: pcrRatio,
        })
      })

      breakdownPerHospital[hospital] = {
        lastPatientAdmittedOn: getLastAdmitedPatientDate(patientsPCRForHospital),
        patientsCountPCR: patientsPCRForHospital.length,
        patientsCountPerDay: getPatientsCountPerDay(patientsPCRForHospital),
        byService: newPatientsGroupedByService,
      }
    })
    
  return {
    currentCovidPatientsCount: allPatientsPCR.length,
    lastPatientAdmittedOn: getLastAdmitedPatientDate(allPatientsPCR),
    patientsCountPerDay: getPatientsCountPerDay(allPatientsPCR),
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

function extendOrbisWithGlims(orbis: OrbisType, glimsByIPP: GlimsByIppType) {
  return orbis.data.map(patient => {
    const findPatientInGlims = glimsByIPP[patient['IPP']]
    const isPCR = !!findPatientInGlims && findPatientInGlims[0]['is_pcr'] === "Positif"

    return {
      ...patient,
      isPCR,
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