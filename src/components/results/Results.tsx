import React, { useState } from 'react'
import styled from 'styled-components'
import _ from 'underscore'

import ResultsHospital from './ResultsHospital'
import ResultsAll from './ResultsAll'
import { ProcessingResultsType } from '../../lib/types'

function Results({ filesData }: {filesData:  ProcessingResultsType}) {
  const { breakdownPerHospital } = filesData

  const sortedHospitals: string[] = _.sortBy(Object.keys(breakdownPerHospital), h => -breakdownPerHospital[h].patientsCountCovid)
  const [activeHospital, setActiveHospital] = useState<string>(sortedHospitals[0])

  if (!filesData) return null

  return (
    <ResultsContainer>
      <ResultsAll
        activeHospital={activeHospital}
        setActiveHospital={setActiveHospital}
        sortedHospitals={sortedHospitals}
        filesData={filesData} />

      <ResultsHospital
        activeHospital={activeHospital}
        hospitalName={activeHospital}
        hospitalData={breakdownPerHospital[activeHospital]}
      />

    </ResultsContainer>
  )
}



const ResultsContainer = styled.div`
`

export default Results