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
  const { id, name, description, format } = csvConfig
  
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
        onUploadSuccess({ id, fields, data, format: '.xlsx' })
      }
      reader.readAsBinaryString(file)
    }

    if (isCSV) {
      Papa.parse(file, {
        complete: (result: PapaParseResult): void => {
          const { data, meta: { fields } } = result
          const errors = fileHasFieldsErrors(id, fields)
          errors.length > 0 && onUploadError({ id, errors })
          errors.length === 0 && onUploadSuccess({ id, fields, data, format: '.csv' })
        },
        header: true
      })  
    }
  }

  return (
    <UploadContainer>
      <Left>
        <Label>{name}</Label>
        {/* <Description>{description}</Description> */}
        <FileStatus csvConfig={csvConfig} />
      </Left>
      
      <Button variant="contained" color="primary" startIcon={<Publish />}>
        <label htmlFor={`file-upload-${id}`}>{`Choisir un fichier ${name}`}</label>
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

const UploadContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 10px 0;
`

const Left = styled.div`
  flex: 60% 0 0;
  display: flex;
  flex-direction: column;
`

const Label = styled.div`
  font-weight: bold;
  font-size: 20px;
  margin-bottom: 6px;
`

const Description = styled.div`
  font-size: 16px;
`

const Input = styled.input`
  margin-bottom: 10px;
`

const Right = styled.div``