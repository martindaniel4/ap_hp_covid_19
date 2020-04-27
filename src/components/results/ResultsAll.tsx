import React from 'react'
import styled from 'styled-components'
import moment from 'moment'
import { XYPlot, XAxis, YAxis, ChartLabel, VerticalRectSeries, HorizontalGridLines, VerticalGridLines} from 'react-vis'
import { Button } from '@material-ui/core'
import { GetApp } from '@material-ui/icons'
import { CSVLink } from 'react-csv'

import { BigNumber } from '../ui/BigNumber'
import Warnings from './Warnings'
import { HOSPITAL_MAP } from '../../lib/constants'
import { ProcessingResultsType } from '../../lib/types'
import { columnsForHospitalTable } from './table-config'
import { getCSVDataForDownload } from '../../utils/csv-utils'

export default function Results({
  activeHospitalXYZ,
  setActiveHospitalXYZ,
  sortedHospitalsXYZ,
  filesData,
}: {
  activeHospitalXYZ: string,
  setActiveHospitalXYZ: Function,
  sortedHospitalsXYZ: string[],
  filesData: ProcessingResultsType,
}) {
  const {
    patientsCountCovid,
    lastPatientAdmittedOn,
    patientsCountPerDay,
    breakdownPerHospital,
    warnings,
  } = filesData

  let tableDataForAllHospitals = Object.keys(breakdownPerHospital).reduce((acc: any, hospitalXYZ: string) => {
    return acc.concat(breakdownPerHospital[hospitalXYZ].byService)
  }, [])
  const dataForCSVDownload = getCSVDataForDownload(columnsForHospitalTable, tableDataForAllHospitals)
  const todayFormatted = moment().format('DD/MM/YYYY')
  const xDomain = [moment('2020-01-01', 'YYYY-MM-DD').toDate(), 
                   moment().toDate()]

  return (
    <>
      <Warnings warnings={warnings} />

      <Row>
        <div>
          <BigNumber number={patientsCountCovid} label={'patients Covid'} />
          <LastAdmitted>{`Dernier admis: ${lastPatientAdmittedOn}`}</LastAdmitted>

          <Button variant="contained" color="primary" startIcon={<GetApp />}>
            <CSVLinkStyled
              key={'all-hospitals'}
              filename={`aphp-saclay-${todayFormatted}.csv`}
              data={dataForCSVDownload}>
              {`Telecharger les données de tous les hopitaux`}
            </CSVLinkStyled>
          </Button>

          <HospitalList>
            {
              sortedHospitalsXYZ.map(hospitalXYZ => {
                return (
                  <HospitalRow key={hospitalXYZ} onClick={() => setActiveHospitalXYZ(hospitalXYZ)}>
                    <HospitalLabel active={activeHospitalXYZ === hospitalXYZ}>{HOSPITAL_MAP[hospitalXYZ]}</HospitalLabel>
                    <div>{`${breakdownPerHospital[hospitalXYZ].patientsCountCovid} patients`}</div>
                  </HospitalRow>
                )
              })
            }
          </HospitalList>
        </div>

        <div>
          <XYPlot 
            height={300} 
            width={500} 
            xType="time"
            xDomain={xDomain}>
            <HorizontalGridLines />
            <XAxis tickLabelAngle={-45}/>
            <YAxis position='start'/>
            <ChartLabel 
              text="Nombre de patients Covid+"
              className="alt-y-label"
              includeMargin={false}
              xPercent={-0.001}
              yPercent={0.06}
              style={{
                textAnchor: 'end',
                transform: 'rotate(-90)'
              }}
              />
            <VerticalRectSeries color="#0063af" data={patientsCountPerDay} />
          </XYPlot>
        </div>
      </Row>
    </>
  )
}

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const HospitalList = styled.div`
  margin: 40px 0 0 0;
`

const LastAdmitted = styled.div`
  margin-bottom: 20px;
`

const HospitalRow = styled.div`
  margin-bottom: 4px;
  display: flex;
  flex-direction: row;
  align-items: baseline;
`

const HospitalLabel = styled.div`
  color: #0063af;
  cursor: pointer;
  margin-right: 10px;

  &:hover {
    text-decoration: underline;
  }

  ${({ active }: { active: boolean }) => active && `
    font-weight: bold;
  `}
`

const CSVLinkStyled = styled(CSVLink)`
  color: white;
  font-weight: bold;
  text-decoration: none;
`