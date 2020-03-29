import React, { useMemo } from 'react'
import styled from 'styled-components'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'

import { StyledTable } from './ui/Table'
import { BigNumber } from './ui/BigNumber'
import { GROUP_NAME } from '../constants'

export function HospitalResults({ hospitalName, hospitalData }) {
  const columns = useMemo(
    () => [
      {
        Header: 'uma',
        accessor: 'uma'
      },
      {
        Header: 'currentPatientsCount',
        accessor: 'currentPatientsCount'
      },
      {
        Header: 'currentPatientsCountAdult',
        accessor: 'currentPatientsCountAdult'
      },
      {
        Header: 'currentPatientsCountChild',
        accessor: 'currentPatientsCountChild'
      }
    ],
    []
  )

  const data = useMemo(
    () => hospitalData.byUma,
    [hospitalData]
  )

  return (
    <HospitalContainer>
      <HospitalTitleContainer>
        <GroupTitle>{GROUP_NAME}</GroupTitle>
        <HospitalTitle>{hospitalName}</HospitalTitle>
      </HospitalTitleContainer>
      
      <Summary>
        <BigNumber number={hospitalData.currentPatientsCount} label={'patients Covid'} />
        <div>{`Dernier admis: ${hospitalData.lastPatientAdmittedOn}`}</div>
      </Summary>

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

const Summary = styled.div`
  margin-bottom: 30px;
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