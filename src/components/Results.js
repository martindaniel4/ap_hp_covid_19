import React, { useState } from 'react'
import styled from 'styled-components'
import _ from 'underscore'
import {
  XYPlot, 
  XAxis,
  YAxis,
  ChartLabel,
  VerticalBarSeries, 
  HorizontalGridLines, 
  VerticalGridLines
} from 'react-vis'

import { HospitalResults } from './HospitalResults'
import { BigNumber } from './ui/BigNumber'
import { GROUP_NAME } from '../lib/constants'

function Results({ filesData }) {
  console.log(filesData)
  
  const {
    currentCovidPatientsCount,
    lastPatientAdmittedOn,
    patientCountPerDay,
    mapByHospital,
  } = filesData

  const sortedHospital = _.sortBy(Object.keys(mapByHospital), h => -mapByHospital[h].currentPatientsCount)
  const [activeHospital, setActiveHospital] = useState(sortedHospital[0])

  if (!filesData) return null

  return (
    <ResultsContainer>
      <Summary>
        <Title>{GROUP_NAME}</Title>
        
        <FirstRow>
          <div>
            <BigNumber number={currentCovidPatientsCount} label={'patients Covid'} />
            <div>{`Dernier admis: ${lastPatientAdmittedOn}`}</div>

            <HospitalList>
              {
                sortedHospital.map(h => {
                  return (
                    <HospitalRow
                      key={h}
                      onClick={() => setActiveHospital(h)}
                    >
                      <HospitalLabel active={activeHospital === h}>{h}</HospitalLabel>
                      <div>{`${mapByHospital[h].currentPatientsCount} patients`}</div>
                    </HospitalRow>
                  )
                })
              }
            </HospitalList>
          </div>

          <div>
            <XYPlot height={300} width={400} xType="ordinal">
              <HorizontalGridLines />
              <VerticalGridLines />
              <XAxis tickLabelAngle={-45} tickTotal={5} />
              <YAxis />
              <ChartLabel 
                className="alt-x-label"
                includeMargin={false}
                xPercent={0.025}
                yPercent={1.01}
                />
              <ChartLabel 
                text="Nombre de patients Covid+"
                className="alt-y-label"
                includeMargin={false}
                style={{
                  transform: 'rotate(-90)',
                  textAnchor: 'end'
                }}
                />
              <VerticalBarSeries data={patientCountPerDay} />
            </XYPlot>
          </div>
        </FirstRow>
      </Summary>

      {
        activeHospital &&
          <HospitalResults
            hospitalName={activeHospital}
            hospitalData={mapByHospital[activeHospital]}
          />
      }

    </ResultsContainer>
  )
}

const Summary = styled.div`
  margin-bottom: 50px;
`

const Title = styled.div`
  font-size: 30px;
  font-weight: bold;
  margin-bottom: 20px;
`

const FirstRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const HospitalList = styled.div`
  margin: 40px 0 0 0;
`

const HospitalRow = styled.div`
  margin-bottom: 4px;
  display: flex;
  flex-direction: row;
  align-items: baseline;
`

const HospitalLabel = styled.div`
  color: blue;
  cursor: pointer;
  margin-right: 10px;

  &:hover {
    text-decoration: underline;
  }

  ${({ active }) => active && `
    font-weight: bold;
  `}
`

const ResultsContainer = styled.div`
`

export default Results