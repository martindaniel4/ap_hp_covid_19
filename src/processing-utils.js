import _ from 'underscore'
import moment from 'moment'

export const processFiles = (files) => {
  const { orbis, grims } = files

  const orbisMappedByIPP = _.groupBy(orbis.data, patient => patient['IPP'])

  const currentCovidPatients = grims.data
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
    
    // Compute the number of current Covid patients that are not in Grims
    const currentCovidPatientsGroupbyIpp = 
      _.groupBy(currentCovidPatients, patient => patient['ipp'])
    
    const currentCovidPatientsIpp = Object.keys(currentCovidPatientsGroupbyIpp)
    const orbisIpp = Object.keys(orbisMappedByIPP)
    
    const grimsIppNotInOrbis = _.difference(currentCovidPatientsIpp, orbisIpp)

    // Last patient admitted 
    
    const dateLastPatient = 
      _.max(currentCovidPatients, 
        function(patient){
          return moment(patient.dt_deb_visite)
        }).dt_deb_visite
        
    const dateLastPatientText = moment(dateLastPatient)
      .format('MMMM Do YYYY à h:mm:ss a')
      
    // Data for number of patients per day
      
    const countPatientPerDay = _.chain(currentCovidPatients)
      .sortBy(patient => {return moment(patient.dt_deb_visite)})
      .countBy(patient => {return moment(patient.dt_deb_visite).format("MMMM Do YYYY")})
      .value()
    
    const countPatientPerDayGraph =[]
    
    Object.keys(countPatientPerDay).reduce((x, date) => {
      countPatientPerDayGraph.push({'x': date, 'y': countPatientPerDay[date]})
    })
    
  const mapByUMA = _.groupBy(currentCovidPatients, patient => `${patient['hop']} - ${patient['last_uma']}`)
  const tableData = Object.keys(mapByUMA).reduce((acc, hopUma) => {
    const covidPatientsInHopUmaByAge = _.countBy(mapByUMA[hopUma], patient => {
      return patient.dob && moment(patient.dob, 'DD/MM/YYYY').add(18, 'year').isBefore(moment()) ? 'adult': 'child'
    })

    acc.push({
      hopUma,
      covidPatientsAdultCount: covidPatientsInHopUmaByAge['adult'],
      covidPatientsChildCount: covidPatientsInHopUmaByAge['child'],
    })
    return acc
  }, [])
  
  return {
    currentCovidPatientsCount: currentCovidPatients.length,
    lastPatientAdmitted: dateLastPatientText,
    countPatientPerDayGraph: countPatientPerDayGraph,
    tableData
  }
}