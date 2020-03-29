import React, { useMemo } from 'react'
import styled from 'styled-components'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'

import { StyledTable } from './ui/Table'

function Results({ filesData }) {
  const {
    currentCovidPatientsCount,
    tableData,
    lastAdmitedPatientDate,
  } = filesData

  const columns = useMemo(
    () => [
      {
        Header: 'hopUma',
        accessor: 'hopUma'
      },
      {
        Header: 'covidPatientsAdultCount',
        accessor: 'covidPatientsAdultCount'
      },
      {
        Header: 'covidPatientsChildCount',
        accessor: 'covidPatientsChildCount'
      }
    ],
    []
  )

  const data = useMemo(
    () => tableData,
    [tableData]
  )

  return (
    <ResultsContainer>
      <Title>{'Groupe Hospitalier, Paris Saclay'}</Title>
      <Summary>
        <BigNumberContainer>
          <BigNumber>{currentCovidPatientsCount}</BigNumber>
          <div>patients Covid</div>
        </BigNumberContainer>
        <div>{`Dernier admis: ${lastAdmitedPatientDate}`}</div>
      </Summary>

      <Tabs>
        <TabList>
          <Tab>{'Capacité'}</Tab>
          <Tab>{'Sorties'}</Tab>
        </TabList>

        <TabPanel>
          <StyledTable data={data} columns={columns} />
        </TabPanel>
        <TabPanel>
          <h2>{'Hello'}</h2>
        </TabPanel>
      </Tabs>

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

const ResultsContainer = styled.div`
  margin: 100px 0;
`

export default Results