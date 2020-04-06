import _ from 'underscore'
import moment from 'moment'
import { FilesDataType, OrbisType, PatientType, GlimsByIppType, PacsType, PacsByIppType, ProcessingResultsType, PatientsCountPerDayType } from './types'

export const processFiles = (files: FilesDataType): ProcessingResultsType => {
  const { orbis, glims, pacs} = files

  const glimsByIPP: GlimsByIppType = _.groupBy(glims.data, p => p['ipp'])
  const pacsByIPP: PacsByIppType = _.groupBy(pacs.data, p => p['ipp'])

  const allPatients = extendOrbisWithCovid(orbis, glimsByIPP, pacsByIPP)
  const allPatientsCovid = allPatients.filter(p => p.isCovid)
  
  const patientsByHospital = _.groupBy(allPatients, p => getHospitalKey(p['U.ResponsabilitÈ']))
  
  const breakdownPerHospital: any = {}
  Object.keys(patientsByHospital)
    .forEach(hospital => {
      const patientsForHospital = patientsByHospital[hospital]
      const patientsByService = _.groupBy(patientsForHospital, p => p['U.Soins'].split(hospital)[1].trim())
      const patientsCovidForHospital = patientsForHospital.filter(p => p.isCovid)

      const newPatientsGroupedByService: any[] = []
      Object.keys(patientsByService).forEach(service => {
        const patientsInService = patientsByService[service]
        const patientsInServiceCovid = patientsInService.filter(p => p.isCovid)
        const covidRatio = `${Math.floor((patientsInServiceCovid.length / patientsInService.length) * 100)}%`
        
        newPatientsGroupedByService.push({
          service,
          patientsCount: patientsInService.length,
          patientsCountCovid: patientsInServiceCovid.length,
          covidRatio: covidRatio,
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
    currentCovidPatientsCount: allPatientsCovid.length,
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

function extendOrbisWithCovid(orbis: OrbisType, glimsByIPP: GlimsByIppType, pacsByIPP: PacsByIppType) {
  return orbis.data.map(patient => {
    const findPatientInGlims = glimsByIPP[patient['IPP']]
    const findPatientInPacs = pacsByIPP[patient['IPP']]

    const isPCR = !!findPatientInGlims && findPatientInGlims[0]['is_pcr'] === "Positif"
    const isRadio = !!findPatientInPacs && findPatientInPacs[0]['radio'] === '1'
    const isCovid = isPCR || isRadio
    const covidSource = isPCR ? 'glims' : isRadio ? 'pacs' : null

    const chambre = patient['Chambre']
    const roomCode = chambre === '-' ? null : chambre.split(' ')[0]
    
    return {
      ...patient,
      isCovid,
      covidSource,
      roomCode,
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