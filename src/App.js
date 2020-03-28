import React, { useState, useEffect } from 'react';
import styled from 'styled-components'
import { Divider, Button } from '@material-ui/core'
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
    console.log(files)
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
    })
  }

  return (
    <AppContainer>
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
      {
        !areAllFilesValid() &&
          <ColorButton
            variant="contained"
            color="primary"
            startIcon={<Assessment />}>
            {'Analyser'}
          </ColorButton>
      }
      {
        areAllFilesValid() &&
          <Button
            variant="contained"
            color="primary"
            startIcon={<Assessment />}>
            {'Analyser'}
          </Button>
      }
    </AppContainer>
  )
}

const AppContainer = styled.div`
  width: 1000px;
  margin: 40px auto 0;
`;

const ColorButton = withStyles(theme => ({
  root: {
    color: theme.palette.text.disabled,
    backgroundColor: theme.palette.action.disabled,
    '&:hover': {
      backgroundColor: theme.palette.action.disabled,
    },
  },
}))(Button);

export default App;
