import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import { CSV_CONFIG } from './lib/constants'
import { CSV_CONFIG_FIXTURE } from './fixtures/csv_fixture'
import { processFiles } from './lib/processing-utils'
import './stylesheets/App.css'

import UploadFiles from './components/UploadFiles'
import Results from './components/Results'
import { FilesDataType, FileUploadPayloadType } from './lib/types'

function App() {
  const [files, setFiles] = useState<FilesDataType>(CSV_CONFIG)
  const [data, setData] = useState(null)

  useEffect(() => {
    areAllFilesValid(files) && process(files)
  }, [])

  const areAllFilesValid = (filesOb: FilesDataType) => {
    return Object.values(filesOb).every(csv => csv.data && csv.data.length && csv.valid)
  }

  const onFileComplete = (payload: FileUploadPayloadType) => {
    const { id, data, fields, format } = payload
    console.log(JSON.stringify(payload,null,2))
    const newFiles = {
      ...files,
      [id]: {
        ...files[id],
        data,
        fields,
        valid: true,
        format
      },
    }
    setFiles(newFiles)
    areAllFilesValid(newFiles) && process(newFiles)
  }

  const process = (newFiles: FilesDataType) => {
    const data = processFiles(newFiles)
    setData(data)
  }

  return (
    <AppContainer>
      <Header>{'Groupe Hospitalier, Paris Saclay'}</Header>
      <Subheader>{'Suivi des patients Covid-19 et de capacité'}</Subheader>
      <UploadFiles files={files} onFileComplete={onFileComplete} />
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

export default App;
