import React, { useMemo } from 'react'
import styled from 'styled-components'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'
import {
  XYPlot, 
  XAxis,
  YAxis,
  ChartLabel,
  VerticalBarSeries, 
  HorizontalGridLines, 
  VerticalGridLines
} from 'react-vis'

import { StyledTable } from './ui/Table'
import { BigNumber } from './ui/BigNumber'
import { GROUP_NAME } from '../lib/constants'

export function HospitalResults({ hospitalName, hospitalData }) {
  const columns = useMemo(
    () => [
      {
        Header: 'Unité de Soin',
        accessor: 'service'
      },
      {
        Header: 'Patients',
        accessor: 'currentPatientsCount'
      },
      {
        Header: 'Adultes',
        accessor: 'currentPatientsCountAdult'
      },
      {
        Header: 'Enfants',
        accessor: 'currentPatientsCountChild'
      }
    ],
    []
  )

  const data = useMemo(
    () => hospitalData.byService,
    [hospitalData]
  )

  return (
    <HospitalContainer>
      <HospitalTitleContainer>
        <GroupTitle>{`${GROUP_NAME} / `}</GroupTitle>
        <HospitalTitle>{hospitalName}</HospitalTitle>
      </HospitalTitleContainer>
      
      <FirstRow>
        <div>
          <BigNumber number={hospitalData.currentPatientsCount} label={'patients Covid'} />
          <div>{`Dernier admis: ${hospitalData.lastPatientAdmittedOn}`}</div>
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
            <VerticalBarSeries data={hospitalData.patientCountPerDay} />
          </XYPlot>
        </div>
      </FirstRow>

      <Tabs>
        <TabList>
          <Tab>{'Capacité'}</Tab>
          <Tab>{'Sorties'}</Tab>
        </TabList>

        <TabPanel>
          <StyledTable
            data={data}
            columns={columns}
          />
        </TabPanel>
        <TabPanel>
          <h2>{'TBD'}</h2>
        </TabPanel>
      </Tabs>
      
    </HospitalContainer>
  )
}

const HospitalTitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 20px;
`

const FirstRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const GroupTitle = styled.div`
  font-size: 30px;
  color: #888;
  font-weight: bold;
  margin-right: 10px;
`

const HospitalTitle = styled.div`
  font-size: 30px;
  font-weight: bold;
`

const HospitalContainer = styled.div``