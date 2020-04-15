import React, { useState } from 'react'
import styled from 'styled-components'
import _ from 'underscore'

import ResultsHospital from './ResultsHospital'
import ResultsAll from './ResultsAll'
import { ProcessingResultsType } from '../../lib/types'

function Results({
  filesData
}: {
  filesData: ProcessingResultsType
}) {
  const { breakdownPerHospital } = filesData

  const sortedHospitalsXYZ: string[] = _.sortBy(Object.keys(breakdownPerHospital), h => -breakdownPerHospital[h].patientsCountCovid)
  const [activeHospitalCode, setActiveHospitalCode] = useState<string>(sortedHospitalsXYZ[0])

  if (!filesData) return null

  return (
    <ResultsContainer>
      <ResultsAll
        activeHospitalCode={activeHospitalCode}
        setActiveHospitalCode={setActiveHospitalCode}
        sortedHospitalsXYZ={sortedHospitalsXYZ}
        filesData={filesData} />

      <ResultsHospital
        activeHospitalCode={activeHospitalCode}
        hospitalName={activeHospitalCode}
        hospitalData={breakdownPerHospital[activeHospitalCode]}
      />

    </ResultsContainer>
  )
}

const ResultsContainer = styled.div``

export default Results