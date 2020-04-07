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
import { HOSPITAL_MAP } from '../lib/constants'
import { ProcessingResultsType } from '../lib/types'

function Results({ filesData }: {filesData:  ProcessingResultsType}) {
  const {
    patientsCountCovid,
    lastPatientAdmittedOn,
    patientsCountPerDay,
    breakdownPerHospital,
  } = filesData

  const sortedHospital = _.sortBy(Object.keys(breakdownPerHospital), h => -breakdownPerHospital[h].patientsCountCovid)
  const [activeHospital, setActiveHospital] = useState<string>(sortedHospital[0])

  if (!filesData) return null

  return (
    <ResultsContainer>
      <Summary>
      
        <FirstRow>
          <div>
            <BigNumber number={patientsCountCovid} label={'patients Covid'} />
            <div>{`Dernier admis: ${lastPatientAdmittedOn}`}</div>

            <HospitalList>
              {
                sortedHospital.map(hospital => {
                  return (
                    <HospitalRow key={hospital} onClick={() => setActiveHospital(hospital)}>
                      <HospitalLabel active={activeHospital === hospital}>{HOSPITAL_MAP[hospital]}</HospitalLabel>
                      <div>{`${breakdownPerHospital[hospital].patientsCountCovid} patients`}</div>
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
              <VerticalBarSeries data={patientsCountPerDay} />
            </XYPlot>
          </div>
        </FirstRow>
      </Summary>

      {
        activeHospital &&
          <HospitalResults
            hospitalName={activeHospital}
            hospitalData={breakdownPerHospital[activeHospital]}
          />
      }

    </ResultsContainer>
  )
}

const Summary = styled.div`
  margin-bottom: 50px;
  padding-bottom: 50px;
  border-bottom: solid 1px #ccc;
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

  ${({ active }: { active: boolean }) => active && `
    font-weight: bold;
  `}
`

const ResultsContainer = styled.div`
`

export default Results