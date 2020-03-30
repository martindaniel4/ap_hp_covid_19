import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import { CSV_CONFIG } from './lib/constants'
import { CSV_CONFIG_FIXTURE } from './fixtures/csv_fixture'
import { processFiles } from './lib/processing-utils'
import './stylesheets/App.css'

import UploadFiles from './components/UploadFiles'
import Results from './components/Results'

function App() {
  const [files, setFiles] = useState(CSV_CONFIG)
  const [data, setData] = useState(null)

  useEffect(() => {
    areAllFilesValid(files) && process(files)
  }, [])

  const areAllFilesValid = (filesOb) => {
    return Object.values(filesOb).every(csv => csv.valid)
  }

  const onFileComplete = (payload) => {
    const { id, data, fields } = payload
    const newFiles = {
      ...files,
      [id]: {
        ...files[id],
        data,
        fields,
        valid: true
      },
    }
    setFiles(newFiles)
    areAllFilesValid(newFiles) && process(newFiles)
  }

  const process = (newFiles) => {
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
