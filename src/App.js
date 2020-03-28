import React, { useState, useEffect } from 'react';
import styled from 'styled-components'
import { Divider, Button, CircularProgress } from '@material-ui/core'
import { Assessment } from '@material-ui/icons'
import { withStyles } from '@material-ui/core/styles'

import Upload from './components/Upload'
import './App.css';

const CSV_CONFIG = {
  'orbis': {
    id: 'orbis',
    name: 'Orbis',
    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a',
  },
  'grims': {
    id: 'grims',
    name: 'Grims',
    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a',
  },
  'capacity': {
    id: 'capacity',
    name: 'Capacity',
    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a',
  }
}

function App() {
  const [files, setFiles] = useState(CSV_CONFIG)
  const [isLoading, setIsLoading] = useState(false)

  const areAllFilesValid = () => {
    return Object.values(files).every(csv => csv.valid)
  }

  const onFileComplete = (payload) => {
    console.log(payload)
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
  }

  const submitFiles = () => {
    setIsLoading(true)
    fetch(
      '/files',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: files,
      }
    )
    .then(res => res.json())
    .then(data => {
      console.log(data);
      setIsLoading(false)
    })
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
          <>
            <Upload
              key={csvId}
              csvConfig={files[csvId]}
              onFileComplete={onFileComplete}
            />
            <Divider /> 
          </>
        )
      }

      <LastRow>
        <StepTitle>{`Etape 2 - Analyser les données`}</StepTitle>
        {
          isLoading && <CircularProgress />
        }
        {
          !isLoading && !areAllFilesValid() &&
            <ColorButton
              variant="contained"
              color="primary"
              startIcon={<Assessment />}>
              {'Analyser les données'}
            </ColorButton>
        }
        {
          !isLoading && areAllFilesValid() &&
            <Button
              onClick={submitFiles}
              variant="contained"
              color="primary"
              startIcon={<Assessment />}>
              {'Analyser les données'}
            </Button>
        }
      </LastRow>
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
