import _ from 'underscore'
import moment from 'moment'

export const processFiles = (files) => {
  const { orbis, grims } = files

  // orbisMappedByIPP = {'08290756': {}, '08028476': {}, ...}
  const orbisMappedByIPP = _.groupBy(orbis.data, patient => patient['IPP'])

  // [ {gims_fields + dob}, {}, {} ]
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

  // { 'hop-uma': [ Patient<>, Patient<>, Patient<> ], 'hop-uma2': [], ...}
  const mapByUMA = _.groupBy(currentCovidPatients, patient => `${patient['hop']} - ${patient['last_uma']}`)

  // [
  //   {
  //     hopUma: 'K BICETRE - UMA X',
  //     covidPatientsAdultCount: 12,
  //     covidPatientsChildCount: 45,
  //   },
  //   {...}
  // ]
  const tableData = Object.keys(mapByUMA).reduce((acc, hopUma) => {
    // {adult: 18, child: 24}
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
    tableData,
  }
}