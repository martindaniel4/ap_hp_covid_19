import React, { useRef, SyntheticEvent } from 'react'
import styled from 'styled-components'
// @ts-ignore
import Papa from 'papaparse'
import XLSX from 'xlsx'
import { Button } from '@material-ui/core'
import { Publish } from '@material-ui/icons'

import { FileType, PapaParseResult } from '../lib/types'
import { checkFileForErrors } from '../lib/file-utils'
import FileStatus from './FileStatus'

export default function Upload({
  csvConfig,
  onUploadSuccess,
  onUploadError
}: {
  csvConfig: FileType,
  onUploadSuccess: Function,
  onUploadError: Function,
}) {
  const fileInput = useRef(null)
  const { id, name } = csvConfig
  
  const onFileChange = (e: SyntheticEvent): void => {
    const file = (e.target as HTMLFormElement).files[0]
    const isXLSX = file.type && file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    const isCSV = file.type && file.type === "text/csv"
    const isFormatNotSupported = !isXLSX && !isCSV

    if (isFormatNotSupported) {
      onUploadError({
        id,
        errors: [{ message: 'File Not Supported' }]
      })
    }

    if (isXLSX) {
      const reader = new FileReader()
      reader.onload = function (e) {
        const workbook = XLSX.read(e.target.result, {type: 'binary'})
        const firstWorksheet = workbook.Sheets[workbook.SheetNames[0]]
        const data: any[] = XLSX.utils.sheet_to_json(firstWorksheet, {header: 0})
        const fields: any = XLSX.utils.sheet_to_json(firstWorksheet, {header: 1})[0]

        const errors = checkFileForErrors({id, data, fields})
        errors.length > 0 && onUploadError({ id, errors })
        errors.length === 0 && onUploadSuccess({ id, data, format: '.xlsx' })
      }
      reader.readAsBinaryString(file)
    }

    if (isCSV) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        encoding: 'CP1252',
        complete: (result: PapaParseResult): void => {
          const { data, meta: { fields } } = result
          const errors = checkFileForErrors({id, data, fields})
          errors.length > 0 && onUploadError({ id, errors })
          errors.length === 0 && onUploadSuccess({ id, data, format: '.csv' })
        },
      })
    }
  }

  return (
    <UploadContainer>
      <Left>
        <Row>
          <Label>{name}</Label>
          <Format>{'(CSV ou XLXS)'}</Format>
        </Row>
        <FileDescription csvConfig={csvConfig} />
        <FileStatus csvConfig={csvConfig} />
      </Left>
      
      <Button variant="outlined" color="primary" startIcon={<Publish />}>
        <label htmlFor={`file-upload-${id}`}>{`Choisir un fichier`}</label>
      </Button>
      <input
        id={`file-upload-${id}`}
        type="file"
        name={id}
        ref={fileInput}
        accept=".xlsx,.csv"
        onChange={onFileChange}
      />

    </UploadContainer>
  )
}

function FileDescription({csvConfig}: {csvConfig: FileType}) {
  const { requiredFields } = csvConfig

  return (
    <SubtitleContainer>
      <div>
        <span>{'Champs requis: '}</span>
        {requiredFields.map((field, index) => {
          return (
            <span key={index}>
              <FieldTag key={field}>{field}</FieldTag>
              {index !== requiredFields.length - 1 && <span>{', '}</span>}
            </span>
          )
        })}
      </div>
    </SubtitleContainer>
  )
}

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
  margin-bottom: 6px;
`

const UploadContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 10px 0;
`

const Left = styled.div`
  flex: 74% 0 0;
  display: flex;
  flex-direction: column;
`

const Label = styled.div`
  font-weight: bold;
  font-size: 20px;
  margin-right: 6px;
  background-color: #ffffb0;
  padding: 0px 4px;
`

const SubtitleContainer = styled.div`
  font-size: 13px;
`

const Format = styled.div`
  font-size: 13px;
  color: #555;
`

const FieldTag = styled.span`
  background-color: #dbdbdb;
  padding: 1px 5px;
  font-family: Monaco;
  font-size: 12px;
  color: #4e4eff;
`

const Right = styled.div``