import React, { useState } from 'react'
import styled from 'styled-components'

import { HospitalResults } from './HospitalResults'

function Results({ filesData }) {
  const [activeHospital, setActiveHospital] = useState(null)

  const {
    currentCovidPatientsCount,
    lastAdmitedPatientDate,
    mapByHospital,
  } = filesData

  return (
    <ResultsContainer>
      <Title>{'Groupe Hospitalier, Paris Saclay'}</Title>
      <Summary>
        <BigNumberContainer>
          <BigNumber>{currentCovidPatientsCount}</BigNumber>
          <div>patients Covid</div>
        </BigNumberContainer>
        <div>{`Dernier admis: ${lastAdmitedPatientDate}`}</div>

        <HospitalList>
          {
            Object.keys(mapByHospital).map(h => {
              return (
                <HospitalLabel
                  key={h}
                  active={activeHospital === h}
                  onClick={() => setActiveHospital(h)}
                >
                  {h}
                </HospitalLabel>
              )
            })
          }
        </HospitalList>
      </Summary>

      {
        activeHospital &&
          <HospitalResults hospitalName={activeHospital} hospitalData={mapByHospital[activeHospital]} />
      }

    </ResultsContainer>
  )
}

const Title = styled.div`
  font-size: 40px;
  color: black;
  font-weight: bold;
  margin-bottom: 20px;
`

const Summary = styled.div`
  background-color: white;
  border: solid 1px #eee;
  padding: 20px;
  margin-bottom: 20px;
`

const BigNumberContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
`

const BigNumber = styled.div`
  font-size: 50px;
  font-weight: bold;
  margin-right: 5px;
`

const HospitalList = styled.div`
  margin: 20px 0;
`

const HospitalLabel = styled.div`
  color: blue;
  font-weight: 500;
  margin-bottom: 4px;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }

  ${({ active }) => active && `
    font-weight: bold;
  `}
`

const ResultsContainer = styled.div`
  margin: 100px 0;
`

export default Results