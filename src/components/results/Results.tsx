import React, { useState } from 'react'
import styled from 'styled-components'
import _ from 'underscore'

import Section from '../ui/Section'
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
  const [activeHospitalXYZ, setActiveHospitalXYZ] = useState<string>(sortedHospitalsXYZ[0])

  if (!filesData) return null

  return (
    <ResultsContainer>
      <Section outerBgColor={'#ececec'}>
        <ResultsAll
          activeHospitalXYZ={activeHospitalXYZ}
          setActiveHospitalXYZ={setActiveHospitalXYZ}
          sortedHospitalsXYZ={sortedHospitalsXYZ}
          filesData={filesData} />
      </Section>

      <Section outerBgColor={'#f9f9f9'}>
        <ResultsHospital
          activeHospitalXYZ={activeHospitalXYZ}
          hospitalName={activeHospitalXYZ}
          hospitalXYZ={activeHospitalXYZ}
          hospitalData={breakdownPerHospital[activeHospitalXYZ]}
        />
      </Section>

    </ResultsContainer>
  )
}

const ResultsContainer = styled.div``

export default Results