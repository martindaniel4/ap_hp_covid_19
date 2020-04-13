import React, { useMemo } from 'react'
import styled from 'styled-components'
import moment from 'moment'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'
import { CSVLink } from 'react-csv'
import { XYPlot,  XAxis, YAxis, ChartLabel, VerticalBarSeries, HorizontalGridLines, VerticalGridLines } from 'react-vis'

import { StyledTable } from './ui/Table'
import { BigNumber } from './ui/BigNumber'
import { HOSPITAL_MAP, capacityTableColumns } from '../lib/constants'

export function HospitalResults({ hospitalName, hospitalData }) {
  const columns = useMemo(
    () => capacityTableColumns,
    []
  )

  const data = useMemo(
    () => hospitalData.byService,
    [hospitalData]
  )

  const headersLabels = capacityTableColumns.map(c => c['Header'])
  const headersAccessors = capacityTableColumns.map(c => c['accessor'])
  const dataForCSVDownload = [headersLabels]
    .concat(hospitalData.byService.map(s => headersAccessors.map(h => s[h]) ))
  const todayFormatted = moment().format('DD/MM/YYYY'); 

  console.log(dataForCSVDownload)

  return (
    <HospitalContainer>
      <HospitalTitleContainer>
        <HospitalTitle>{HOSPITAL_MAP[hospitalName]}</HospitalTitle>
      </HospitalTitleContainer>
      
      <SpacedRow>
        <div>
          <BigNumber number={hospitalData.patientsCountCovid} label={'patients Covid'} />
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
            <VerticalBarSeries data={hospitalData.patientsCountPerDay} />
          </XYPlot>
        </div>
      </SpacedRow>

      <Tabs>
        <TabList>
          <Tab>{'Capacité'}</Tab>
        </TabList>

        <TabPanel>
          <SpacedRow>
            <TableName>{'Table de patients par unité de soins'}</TableName>
            <CSVLinkStyled
              key={hospitalName}
              filename={`aphp-${hospitalName}-${todayFormatted}.csv`}
              data={dataForCSVDownload}>
              {'Telecharger un .csv des données'}
            </CSVLinkStyled>
          </SpacedRow>

          <StyledTable
            data={data}
            columns={columns}
            defaultSortColumn={'patientsCount'}
          />
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

const SpacedRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 20px 0;
`

const HospitalTitle = styled.div`
  font-size: 30px;
  font-weight: bold;
`

const TableName = styled.div`
  font-size: 20px;
  font-weight: bold;
`

const CSVLinkStyled = styled(CSVLink)`
  color: #3e4bfffa;
  font-weight: bold;
`

const HospitalContainer = styled.div``