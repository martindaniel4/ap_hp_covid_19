import _ from 'underscore'
import moment from 'moment'

export const processFiles = (files) => {
  const { orbis, grims } = files

  const orbisMappedByIPP = _.groupBy(orbis.data, p => p['IPP'])
  const currentCovidPatients = mergeOrbisInGrims(grims, orbisMappedByIPP)
  const tempMapByHospital = _.groupBy(currentCovidPatients, p => p['hop'])

  const mapByHospital = {}
  Object.keys(tempMapByHospital)
    .forEach(h => {
      const listOfPatientsForHospital = tempMapByHospital[h]
      const patientsGroupedByUMA = _.groupBy(listOfPatientsForHospital, p => p['last_uma'])

      const newPatientsGroupedByUMA = []
      Object.keys(patientsGroupedByUMA)
        .forEach(uma => {
          const currentPatients = patientsGroupedByUMA[uma]
          const currentPatientsByAge = _.countBy(currentPatients, p => {
            return p.dob && moment(p.dob, 'DD/MM/YYYY').add(18, 'year').isAfter(moment()) ? 'child': 'adult'
          })

          newPatientsGroupedByUMA.push({
            uma,
            currentPatientsCount: patientsGroupedByUMA[uma].length,
            currentPatientsCountAdult: currentPatientsByAge['adult'] || 0,
            currentPatientsCountChild: currentPatientsByAge['child'] || 0,
          })
        })

      mapByHospital[h] = {
        lastPatientAdmittedOn: getLastAdmitedPatientDate(listOfPatientsForHospital),
        currentPatientsCount: listOfPatientsForHospital.length,
        patientCountPerDay: getPatientCountPerDay(listOfPatientsForHospital),
        byUma: newPatientsGroupedByUMA,
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

function mergeOrbisInGrims(grims, orbisMappedByIPP) {
  return grims.data
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
    .countBy(p => {return moment(p.dt_deb_visite).format("MMMM Do YYYY")})
    .value()

  return Object.keys(patientCountPerDay).reduce((acc, date) => {
    acc.push({
      x: date,
      y: patientCountPerDay[date]
    })
    return acc
  }, [])
}