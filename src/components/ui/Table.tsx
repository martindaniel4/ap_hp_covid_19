import React from 'react'
import styled from 'styled-components'
import { useTable, useSortBy } from 'react-table'
import { ServicesDedicatedToCovidMapType } from '../../lib/types'

export function StyledTable({
  columns,
  data,
  defaultSortColumn,
  mapOfServicesDedicatedToCovid,
}: {
  columns: any[],
  data: any[],
  defaultSortColumn: string,
  mapOfServicesDedicatedToCovid: ServicesDedicatedToCovidMapType,
}) {
  return (
    <Styles>
      <Table
        data={data}
        columns={columns}
        defaultSortColumn={defaultSortColumn}
        mapOfServicesDedicatedToCovid={mapOfServicesDedicatedToCovid}
      />
    </Styles>
  )
}

function Table({ columns, data, defaultSortColumn, mapOfServicesDedicatedToCovid }) {
  const {getTableProps, getTableBodyProps, headerGroups, rows, prepareRow} = useTable(
    {
      columns,
      data,
      initialState: {
        sortBy: [{ id: defaultSortColumn, desc: true }]
      }
    },
    useSortBy
  )

  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup
              .headers
              .map(column => (
                <th {...column.getHeaderProps(column.getSortByToggleProps)}>
                  <div className={column.isSorted ? 'sortedColumn' : ''}>{column.render('Header')}</div>
                  <div className={column.isSorted ? 'sortedColumnIcon' : ''}>
                    {column.isSorted ? (column.isSortedDesc ? ' ▼' : ' ▲') : '▶'}
                  </div>
                </th>
              ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          const rowBelongsToACovidDedicatedService = !!mapOfServicesDedicatedToCovid[row.values.serviceName]
          return (
            <tr {...row.getRowProps()}>
              {row
                .cells
                .map(cell => {
                  return <td
                    {...cell.getCellProps()}
                    style={{backgroundColor: rowBelongsToACovidDedicatedService ? '#ffffbe': 'transparent'}}>
                      {cell.render('Cell')}
                  </td>
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