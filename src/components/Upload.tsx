import React, { useRef, SyntheticEvent } from 'react'
import styled from 'styled-components'
// @ts-ignore
import Papa from 'papaparse'
import XLSX from 'xlsx'
import { Button } from '@material-ui/core'
import { Done, Publish } from '@material-ui/icons'
import { withStyles } from '@material-ui/core/styles'

import { FileType, PapaParseResult } from '../lib/types'

function Upload({
  csvConfig,
  onFileComplete,
}: {
  csvConfig: FileType,
  onFileComplete: Function,
}) {
  const fileInput = useRef(null)
  const { id, name, description, valid, fields, data, format } = csvConfig
  
  const analyzeCSV = (e: SyntheticEvent): void => {
    const uploadFile = (e.target as HTMLFormElement).files[0]
    const isXLSX = uploadFile.type && uploadFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    const isCSV = uploadFile.type && uploadFile.type === "text/csv"

    if (isXLSX){
      const reader = new FileReader()
      reader.onload = function (e) {
        const workbook = XLSX.read(e.target.result, {type: 'binary'})
        const firstWorksheet = workbook.Sheets[workbook.SheetNames[0]]
        const fileData = XLSX.utils.sheet_to_json(firstWorksheet, {header:0});
        const fileFields = XLSX.utils.sheet_to_json(firstWorksheet, {header:1})[0];
        updateDataFromXLSX(fileData, fileFields)

      }
      reader.readAsBinaryString(uploadFile);
    }

    if (isCSV){
      Papa.parse(uploadFile, {
        complete: updateDataFromCSV,
        encoding: "CP1252",
        skipEmptyLines: true,
        header: true
      });  
    }
  }

  const updateDataFromCSV = (result: PapaParseResult): void => {
    const { id } = csvConfig
    const { data, meta: { fields } } = result
    const format = "csv"

    onFileComplete({
      id,
      fields,
      data,
      format,
    })
  }

  const updateDataFromXLSX = (data, fields): void => {
    const { id } = csvConfig
    const format = "xlsx"

    onFileComplete({
      id,
      fields,
      data,
      format,
    })
  }


  return (
    <UploadContainer>
      <Left>
        <Label>{name}</Label>
        <Description>{description}</Description>
      </Left>
      <UploadWrapper>
        <>
          {
            !valid &&
              <Button variant="contained" color="primary" startIcon={<Publish />}>
                <label htmlFor={`file-upload-${id}`}>Choisir un fichier</label>
              </Button>
          }
          {
            valid &&
              <>
                <ColorButton variant="contained" color="primary" startIcon={<Done />}>
                  Fichier Valide
                </ColorButton>
                <Summary>{`Fichier ${format}, ${data.length} rangées, ${fields.length} colonnes.`}</Summary>
              </>
          }
          <Input
            id={`file-upload-${id}`}
            type="file"
            name={id}
            ref={fileInput}
            accept=".xlsx,.csv"
            onChange={analyzeCSV}
          />
        </>
      </UploadWrapper>
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

const UploadWrapper = styled.div`
`

const Input = styled.input`
  margin-bottom: 10px;
`

const Summary = styled.div`
  font-style: italic;
  margin-top: 6px;
  font-size: 12px;
`

const ColorButton = withStyles(theme => ({
  root: {
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.success.main,
    '&:hover': {
      backgroundColor: theme.palette.success.main,
    },
  },
}))(Button);

export default Upload