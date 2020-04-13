import React, { useRef, SyntheticEvent } from 'react'
import styled from 'styled-components'
// @ts-ignore
import Papa from 'papaparse'
import XLSX from 'xlsx'
import { Button } from '@material-ui/core'
import { Publish } from '@material-ui/icons'

import { FileType, PapaParseResult } from '../lib/types'
import { fileHasFieldsErrors } from '../lib/file-utils'
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

        const errors = fileHasFieldsErrors(id, fields)
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
          const errors = fileHasFieldsErrors(id, fields)
          errors.length > 0 && onUploadError({ id, errors })
          errors.length === 0 && onUploadSuccess({ id, data, format: '.csv' })
        },
      })
    }
  }

  return (
    <UploadContainer>
      <Left>
        <Label>{name}</Label>
        <FileDescription csvConfig={csvConfig} />
        <FileStatus csvConfig={csvConfig} />
      </Left>
      
      <Button variant="contained" color="primary" startIcon={<Publish />}>
        <label htmlFor={`file-upload-${id}`}>{`Choisir un fichier`}</label>
      </Button>
      <Input
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
  const { description, fields } = csvConfig

  return (
    <DescriptionContainer>
      <Description>{description}</Description>
      <div>
        <span>Les champs requis sont: </span>
        {fields.map((field, index) => {
          return (
            <span key={index}>
              <FieldTag key={field}>{field}</FieldTag>
              {index !== fields.length - 1 && <span>{', '}</span>}
            </span>
          )
        })}
      </div>
    </DescriptionContainer>
  )
}

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
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
  margin-bottom: 6px;
`

const DescriptionContainer = styled.div`
  font-size: 14px;
`

const Description = styled.div`
  margin-bottom: 4px;
`

const Input = styled.input`
  margin-bottom: 10px;
`

const FieldTag = styled.span`
  background-color: #dbdbdb;
  padding: 1px 5px;
  font-family: Monaco;
  font-size: 12px;
  color: #4e4eff;
`

const Right = styled.div``