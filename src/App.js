import React, { useState } from 'react';
import styled from 'styled-components'
import { Divider } from '@material-ui/core'

import Upload from './components/Upload'
import Results from './components/Results'
import { CSV_CONFIG } from './constants'
import { processFiles } from './processing-utils'
import './App.css';

function App() {
  const [files, setFiles] = useState(CSV_CONFIG)
  const [data, setData] = useState(null)

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
      <Header><span role="img" aria-label="Hospital">&#x1F3E5;</span> Hopitaux de Paris FC.</Header>
      <StepTitleContainer>
        <StepTitle>{`Etape 1 - Uploader les ${Object.keys(CSV_CONFIG).length} fichiers`}</StepTitle>
      </StepTitleContainer>
      <Divider /> 
      {
        Object.keys(files).map(csvId =>
          <div key={csvId}>
            <Upload
              csvConfig={files[csvId]}
              onFileComplete={onFileComplete}
            />
            <Divider /> 
          </div>
        )
      }
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
  margin-bottom: 50px;
`

const StepTitle = styled.div`
  font-size: 26px;
  font-weight: bold;
`

const StepTitleContainer = styled.div`
  margin-bottom: 20px;
`

export default App;
