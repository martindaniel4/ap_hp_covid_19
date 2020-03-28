import React, { useState } from 'react';
import styled from 'styled-components'
import { Divider, Button, CircularProgress } from '@material-ui/core'
import { Assessment } from '@material-ui/icons'
import { withStyles } from '@material-ui/core/styles'

import Upload from './components/Upload'
import Results from './components/Results'
import { CSV_CONFIG } from './constants'
import { processFiles } from './processing-utils'
import './App.css';

function App() {
  const [files, setFiles] = useState(CSV_CONFIG)
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

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
    setIsLoading(true)
    const data = processFiles(newFiles)
    setData(data)
    setIsLoading(false)
  }

  return (
    <AppContainer>
      <Header>&#x1F3E5; Hopitaux de Paris FC.</Header>
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

const LastRow = styled.div`
  margin-top: 40px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 40px 0 20px 0;
`

const ColorButton = withStyles(theme => ({
  root: {
    color: theme.palette.text.disabled,
    backgroundColor: theme.palette.action.disabledBackground,
    '&:hover': {
      backgroundColor: theme.palette.action.disabledBackground,
    },
  },
}))(Button);

export default App;
