import React, { useMemo } from 'react'
import styled from 'styled-components'
import moment from 'moment'
import 'react-tabs/style/react-tabs.css'
import { CSVLink } from 'react-csv'
import { XYPlot,  XAxis, YAxis, ChartLabel, VerticalBarSeries, HorizontalGridLines, VerticalGridLines } from 'react-vis'
import { Button } from '@material-ui/core'
import { GetApp } from '@material-ui/icons'

import { StyledTable } from '../ui/Table'
import { BigNumber } from '../ui/BigNumber'
import { HOSPITAL_MAP } from '../../lib/constants'
import { columnsForHospitalTable } from './table-config'
import { HospitalData } from '../../lib/types'
import { getCSVDataForDownload } from '../../utils/csv-utils'

export default function HospitalResults({
  activeHospitalXYZ,
  hospitalName,
  hospitalXYZ,
  hospitalData
}: {
  activeHospitalXYZ: string,
  hospitalName: string,
  hospitalXYZ: string,
  hospitalData: HospitalData,
}) {
  const columns = useMemo(
    () => columnsForHospitalTable,
    []
  )

  const data = useMemo(
    () => hospitalData.byService,
    [hospitalData]
  )

  if (!activeHospitalXYZ) return null

  const dataForCSVDownload = getCSVDataForDownload(columnsForHospitalTable, hospitalData.byService)
  const todayFormatted = moment().format('DD/MM/YYYY')

  return (
    <HospitalContainer>
      
      <SpacedRow>
        <div>
          <HospitalTitleContainer>
            <HospitalTitle>{HOSPITAL_MAP[hospitalName]}</HospitalTitle>
          </HospitalTitleContainer>
          <BigNumber number={hospitalData.patientsCountCovid} label={'patients Covid'} />
          <LastAdmitted>{`Dernier admis: ${hospitalData.lastPatientAdmittedOn}`}</LastAdmitted>

          <Button variant="contained" color="primary" startIcon={<GetApp />}>
            <CSVLinkStyled
              key={hospitalName}
              filename={`aphp-${hospitalName}-${todayFormatted}.csv`}
              data={dataForCSVDownload}>
              {`Telecharger les données de ${hospitalXYZ}`}
            </CSVLinkStyled>
          </Button>
        </div>

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
      </SpacedRow>

      <StyledTable
        data={data}
        columns={columns}
        defaultSortColumn={'capacityTotal'}
      />
      
    </HospitalContainer>
  )
}

const HospitalTitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 20px;
`

const LastAdmitted = styled.div`
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

const HospitalTitle = styled.div`
  font-size: 34px;
  font-weight: 800;
  color: #0063af;
`

const CSVLinkStyled = styled(CSVLink)`
  color: white;
  font-weight: bold;
  text-decoration: none;
`

const HospitalContainer = styled.div``