import React, { useMemo } from 'react'
import styled from 'styled-components'

import {
  useTable,
} from 'react-table'

import {XYPlot, VerticalBarSeries, HorizontalGridLines,
        VerticalGridLines} from 'react-vis';

function Results({ filesData }) {
  const { currentCovidPatientsCount, 
          lastPatientAdmitted, 
          countPatientPerDayGraph,
          tableData } = filesData
  
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
      <div>{`Dernier patient admis le ${lastPatientAdmitted}`}</div>
      <div>{`Nombre de patients Covid+: ${currentCovidPatientsCount}`}</div>
      
      <XYPlot height={200} width={400} xType="ordinal">
        <VerticalGridLines />
        <HorizontalGridLines />
        <VerticalBarSeries data={countPatientPerDayGraph} />
      </XYPlot>
      
      <Styles>
        <Table
          data={data}
          columns={columns}
        />
      </Styles>

    </ResultsContainer>
  )
}

function Table({columns, data}) {
  const {getTableProps, getTableBodyProps, headerGroups, rows, prepareRow} = useTable({columns, data})

  // Render Data Table UI
  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup
              .headers
              .map(column => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row
                .cells
                .map(cell => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

const Styles = styled.div `
  table {
    width: 100%;
    border-spacing: 0;
    border: 1px solid black;
    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }
    th,
    td {
      margin: 0;
      padding: 1rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;
      :last-child {
        border-right: 0;
      }
    }
  }
`

const ResultsContainer = styled.div`
  margin: 100px 0;
`

export default Results