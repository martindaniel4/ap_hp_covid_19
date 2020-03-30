import _ from 'underscore'
import moment from 'moment'

import { CHILD_ADULT_CUTOFF_AGE } from './constants'

export const processFiles = (files) => {
  const { orbis, glims, capacity } = files

  const orbisMappedByIPP = _.groupBy(orbis.data, p => p['IPP'])
  const capacityMappedByService = _.groupBy(capacity.data, s => s['last_uma'])
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
          const findService = capacityMappedByService[service]
          const serviceCapacity = findService ? findService[0]['capacity'] : ''
          const currentPatientsCount = patientsGroupedByService[service].length
          const availableBeds = serviceCapacity ? serviceCapacity-currentPatientsCount : '-'
          
          newPatientsGroupedByService.push({
            service,
            currentPatientsCount,
            currentPatientsCountAdult: currentPatientsByAge['adult'] || 0,
            currentPatientsCountChild: currentPatientsByAge['child'] || 0,
            serviceCapacity,
            availableBeds,
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
  const date = _.max(listOfPatients, patient => moment(patient.entryDate)).entryDate
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
      const entryDate = findOrbisData ? findOrbisData[0]["Date d'entrée du dossier"] : ''

      return {
        ...patient,
        dob,
        entryDateFromOrbis: entryDate,
      }
    })
}

function getPatientCountPerDay(patientsList) {
  const patientCountPerDay = _.chain(patientsList)
    .sortBy(p => {return moment(p.entryDate)})
    .countBy(p => {return moment(p.entryDate).format("DD/MM")})
    .value()

  return Object.keys(patientCountPerDay).reduce((acc, date) => {
    acc.push({
      x: date,
      y: patientCountPerDay[date]
    })
    return acc
  }, [])
}