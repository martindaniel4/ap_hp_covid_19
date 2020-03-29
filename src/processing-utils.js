import _ from 'underscore'
import moment from 'moment'

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

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

//all Patients without filter on dt_fin_visite
  const allCovidPatients = grims.data
    .filter(patient => {
      return patient.ipp !== '' && patient.is_pcr === 'Positif'
    })
    .map(patient => {
      const dateDeb = patient.dt_deb_visite ? formatDate(patient.dt_deb_visite) : null
      const dateFin = patient.dt_fin_visite ? formatDate(patient.dt_fin_visite) : null

      return {
        ...patient,
        dateDeb,
        dateFin
      }
    })
  
//First table: hopUma | covidPatientsAdultCount | covidPatientsChildCount

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

//Second table: hopUma | date | covidInCount | covidOutCount

  const mapAllByUMA = _.groupBy(allCovidPatients, patient => `${patient['hop']} - ${patient['last_uma']}`)

  const listDates =_.union(allCovidPatients.map(item => item.dateDeb),allCovidPatients.map(item => item.dateFin))

  const inOutTable = Object.keys(mapAllByUMA).reduce((acc, hopUma) => {
      const covidPatientsInHopUmaByDateDeb = _.countBy(mapAllByUMA[hopUma], 'dateDeb')
      const covidPatientsInHopUmaByDateFin = _.countBy(mapAllByUMA[hopUma], 'dateFin')
      var covidin=0
      var covidout=0
      _.each(listDates,function(dt){
        if(dt!=null){
          covidin=covidPatientsInHopUmaByDateDeb[dt]
          covidout=covidPatientsInHopUmaByDateFin[dt]
          acc.push({
            hopUma,
            date:dt,
            covidInCount:covidin,
            covidOutCount:covidout
          })
        }
      })
      return acc
    }, [])
  
  const sortedInOutTable = _.sortBy(( _.sortBy(inOutTable, function(o) { return o.date; })), 'hopUma')

  return {
    currentCovidPatientsCount: currentCovidPatients.length,
    tableData,
    sortedInOutTable
  }
}