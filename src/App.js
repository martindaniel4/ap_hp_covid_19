import React, { useState, useEffect } from 'react';
import styled from 'styled-components'

import Upload from './components/Upload'
import './App.css';

const CSV_CONFIG = [
  {
    id: 'orbis',
    name: 'Orbis',
    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a',
  },
  {
    id: 'grims',
    name: 'Grims',
    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a',
  },
  {
    id: 'capacity',
    name: 'Capacity',
    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a',
  }
]

function App() {
  const [files, setFiles] = useState({})

  const onFileComplete = (payload) => {
    const { id, data, fields } = payload
    const newFiles = {
      ...files,
      [id]: {
        data,
        fields,
        valid: true,
      },
    }
    setFiles(newFiles)
  }

  return (
    <AppContainer>
      {
        CSV_CONFIG.map(csvConfig =>
          <Upload
            key={csvConfig.id}
            csvConfig={csvConfig}
            enabled={true}
            onFileComplete={onFileComplete}
          />
        )
      }
    </AppContainer>
  )
}

const AppContainer = styled.div`
  width: 600px;
  margin: 40px auto 0;
`;

const Button = styled.button`
  width: 200px;
  height: 40px;
  color: white;
  background: black;
`

export default App;
