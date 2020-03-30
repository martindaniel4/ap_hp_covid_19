import _ from 'underscore'
import moment from 'moment'

import { CHILD_ADULT_CUTOFF_AGE } from './constants'

export const processFiles = (files) => {
  const { orbis, glims } = files

  const orbisMappedByIPP = _.groupBy(orbis.data, p => p['IPP'])
  const currentCovidPatients = mergeOrbisInGlims(glims, orbisMappedByIPP)
  const tempMapByHospital = _.groupBy(currentCovidPatients, p => p['hop'])

  const mapByHospital = {}
  Object.keys(tempMapByHospital)
    .forEach(h => {
      const listOfPatientsForHospital = tempMapByHospital[h]
      const patientsGroupedByService = _.groupBy(listOfPatientsForHospital, p => p['last_uma'])

      const newPatientsGroupedByService = []
      Object.keys(patientsGroupedByService)
        .forEach(service => {
          const currentPatients = patientsGroupedByService[service]
          const currentPatientsByAge = _.countBy(currentPatients, p => {
            return p.dob && moment(p.dob, 'DD/MM/YYYY').add(CHILD_ADULT_CUTOFF_AGE, 'year').isAfter(moment()) ? 'child': 'adult'
          })

          newPatientsGroupedByService.push({
            service,
            currentPatientsCount: patientsGroupedByService[service].length,
            currentPatientsCountAdult: currentPatientsByAge['adult'] || 0,
            currentPatientsCountChild: currentPatientsByAge['child'] || 0,
          })
        })

      mapByHospital[h] = {
        lastPatientAdmittedOn: getLastAdmitedPatientDate(listOfPatientsForHospital),
        currentPatientsCount: listOfPatientsForHospital.length,
        patientCountPerDay: getPatientCountPerDay(listOfPatientsForHospital),
        byService: newPatientsGroupedByService,
      }
    })
  
  return {
    currentCovidPatientsCount: currentCovidPatients.length,
    lastPatientAdmittedOn: getLastAdmitedPatientDate(currentCovidPatients),
    patientCountPerDay: getPatientCountPerDay(currentCovidPatients),
    mapByHospital
  }
}

// =============================================
// "PRIVATE" UTILS
// =============================================

function getLastAdmitedPatientDate(listOfPatients) {
  const date = _.max(listOfPatients, patient => moment(patient.dt_deb_visite)).dt_deb_visite
  return moment(date).format('Do MMMM YYYY à H:MM')
}

function mergeOrbisInGlims(glims, orbisMappedByIPP) {
  return glims.data
    .filter(patient => {
      return patient.ipp !== '' && patient.is_pcr === 'Positif' && patient.dt_fin_visite === ''
    })
    .map(patient => {
      const findOrbisData = orbisMappedByIPP[patient.ipp]
      const dob = findOrbisData ? findOrbisData[0]['Né(e) le'] : ''

      return {
        ...patient,
        dob,
      }
    })
}

function getPatientCountPerDay(patientsList) {
  const patientCountPerDay = _.chain(patientsList)
    .sortBy(p => {return moment(p.dt_deb_visite)})
    .countBy(p => {return moment(p.dt_deb_visite).format("DD/MM")})
    .value()

  return Object.keys(patientCountPerDay).reduce((acc, date) => {
    acc.push({
      x: date,
      y: patientCountPerDay[date]
    })
    return acc
  }, [])
}