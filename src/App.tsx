import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import { CSV_CONFIG } from './lib/constants'
import { processFiles } from './lib/processing-utils'
import './stylesheets/App.css'

import Files from './components/Files'
import Results from './components/Results'
import { FilesDataType, FileUploadPayloadType, ErrorType } from './lib/types'
import { buildInitialStateFromFixture } from './fixtures/fixtures-utils'

const USE_FIXTURE = false

export default function App() {
  const initialState = buildInitialStateFromFixture(USE_FIXTURE)
  const [files, setFiles] = useState<FilesDataType>(initialState)
  const [data, setData] = useState(null)

  useEffect(() => {
    areAllFilesValid(files) && process(files)
  }, [])

  const areAllFilesValid = (filesOb: FilesDataType) => {
    return Object.values(filesOb).every(csv => csv.data && csv.data.length && csv.errors.length === 0)
  }

  const onUploadSuccess = (payload: FileUploadPayloadType) => {
    const { id, data, format } = payload
    const newFiles = {
      ...files,
      [id]: {
        ...files[id],
        data,
        errors: [],
        format
      },
    }
    setFiles(newFiles)
    areAllFilesValid(newFiles) && process(newFiles)
  }

  const onUploadError = ({
    id,
    errors
  }: {
    id: string,
    errors: ErrorType[]
  }) => {
    const newFiles = {
      ...files,
      [id]: {
        ...files[id],
        errors,
      },
    }
    setFiles(newFiles)
  }

  const process = (newFiles: FilesDataType) => {
    const data = processFiles(newFiles)
    setData(data)
  }

  return (
    <AppContainer>
      <Header>{'Groupe Hospitalier, Paris Saclay'}</Header>
      <Subheader>{'Suivi des patients Covid-19 et de capacité'}</Subheader>
      <Files files={files} onUploadError={onUploadError} onUploadSuccess={onUploadSuccess} />
      {data && <Results filesData={data} />}
    </AppContainer>
  )
}

const AppContainer = styled.div`
  width: 1000px;
  margin: 40px auto 0;
  padding-bottom: 100px;
`;

const Header = styled.div`
  font-size: 30px;
  font-weight: bold;
  margin-bottom: 10px;
`

const Subheader = styled.div`
  font-size: 20px;
  margin-bottom: 40px;
`