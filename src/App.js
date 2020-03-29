import React, { useState, useEffect } from 'react';
import styled from 'styled-components'
import { Divider } from '@material-ui/core'

import { CSV_CONFIG } from './constants'
import { CSV_CONFIG_FIXTURE } from './fixtures/csv_fixture'
import { processFiles } from './processing-utils'
import './App.css';

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
      <Header><span role="img" aria-label="Hospital">&#x1F3E5;</span>{'GH, Paris Saclay'}</Header>
      <UploadFiles files={files} onFileComplete={onFileComplete} />
      {data && <Results filesData={data} />}
    </AppContainer>
  )
}

const AppContainer = styled.div`
  width: 1000px;
  margin: 40px auto 0;
`;

const Header = styled.div`
  font-size: 40px;
  color: #ff6a6a;
  font-weight: bold;
  margin-bottom: 40px;
`

export default App;
