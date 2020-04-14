import React, { useMemo } from 'react'
import styled from 'styled-components'
import moment from 'moment'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'
import { CSVLink } from 'react-csv'
import { XYPlot,  XAxis, YAxis, ChartLabel, VerticalBarSeries, HorizontalGridLines, VerticalGridLines } from 'react-vis'

import { StyledTable } from '../ui/Table'
import { BigNumber } from '../ui/BigNumber'
import { HOSPITAL_MAP, capacityTableColumns } from '../../lib/constants'

export default function HospitalResults({ activeHospital, hospitalName, hospitalData }) {
  const columns = useMemo(
    () => capacityTableColumns,
    []
  )

  const data = useMemo(
    () => hospitalData.byService,
    [hospitalData]
  )

  if (!activeHospital) return null

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
          <XYPlot height={200} width={500} xType="ordinal">
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
            <VerticalBarSeries color="#0063af" data={hospitalData.patientsCountPerDay} />
          </XYPlot>
        </div>
      </SpacedRow>

      <Tabs>
        <TabList>
          <Tab>{'Table de patients par unité de soins'}</Tab>
        </TabList>

        <TabPanel>
          <EndRow>
            <CSVLinkStyled
              key={hospitalName}
              filename={`aphp-${hospitalName}-${todayFormatted}.csv`}
              data={dataForCSVDownload}>
              {'Telecharger un .csv des données'}
            </CSVLinkStyled>
          </EndRow>

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

const Row = styled.div`
  display: flex;
  flex-direction: row;
  margin: 20px 0;
`

const SpacedRow = styled(Row)`
  justify-content: space-between;
`

const EndRow = styled(Row)`
  justify-content: end;
`

const HospitalTitle = styled.div`
  font-size: 34px;
  font-weight: 800;
  color: #0063af;
`

const TableName = styled.div`
  font-size: 20px;
  font-weight: bold;
`

const CSVLinkStyled = styled(CSVLink)`
  color: #0063af;
  font-weight: bold;
`

const HospitalContainer = styled.div``