import React, { useRef, SyntheticEvent } from 'react'
import styled from 'styled-components'
// @ts-ignore
import Papa from 'papaparse'
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
  const { id, name, description, valid, fields, data } = csvConfig
  
  const analyzeCSV = (e: SyntheticEvent): void => {
    Papa.parse((e.target as HTMLFormElement).files[0], {
      complete: updateData,
      header: true
    });
  }

  const updateData = (result: PapaParseResult): void => {
    const { id } = csvConfig
    const { data, meta: { fields } } = result

    onFileComplete({
      id,
      fields,
      data,
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
                <Summary>{`${data.length} rangées, ${fields.length} colonnes.`}</Summary>
              </>
          }
          <Input
            id={`file-upload-${id}`}
            type="file"
            name={id}
            ref={fileInput}
            accept=".csv"
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