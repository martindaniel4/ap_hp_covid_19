import React, { useMemo } from 'react'
import styled from 'styled-components'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'

import { StyledTable } from './ui/Table'
import { BigNumber } from './ui/BigNumber'

export function HospitalResults({ hospitalName, hospitalData }) {

  console.log(hospitalData)

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
      <div>{hospitalName}</div>
      <BigNumber number={hospitalData.currentPatientsCount} label={'patients Covid'} />
      <div>{`Dernier admis: ${hospitalData.lastPatientAdmitted}`}</div>

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

const HospitalContainer = styled.div``