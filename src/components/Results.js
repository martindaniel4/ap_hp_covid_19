import React, { useMemo } from 'react'
import styled from 'styled-components'

import {
  useTable,
} from 'react-table'

function Results({ filesData }) {
  const { currentCovidPatientsCount, tableData, sortedInOutTable} = filesData
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

  const columnsInOut = useMemo(
    () => [
      {
        Header: 'hopUma',
        accessor: 'hopUma'
      },
      {
        Header: 'date',
        accessor: 'date'
      },
      {
        Header: 'covidInCount',
        accessor: 'covidInCount'
      },
      {
        Header: 'covidOutCount',
        accessor: 'covidOutCount'
      }
    ],
    []
  )

  const data = useMemo(
    () => tableData,
    [tableData]
  )

  const dataInOut = useMemo(
    () => sortedInOutTable,
    [sortedInOutTable]
  )

  return (
    <ResultsContainer>
      <div>{`${currentCovidPatientsCount} current covid patients`}</div>

      <Styles>
        <Table
          data={data}
          columns={columns}
        />
        <div>{'Entrées et sorties des patients covid'}</div>
        <Table
          data={dataInOut}
          columns={columnsInOut}
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