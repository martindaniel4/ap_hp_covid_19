import React, { useState, useEffect } from 'react';
import styled from 'styled-components'

import Upload from './components/Upload'
import logo from './logo.svg';
import './App.css';

const CSV_CONFIG = [
  {
    id: 1,
    name: 'CSV 1'
  },
  {
    id: 2,
    name: 'CSV 2'
  },
  {
    id: 3,
    name: 'CSV 3'
  }
]

function App() {
  const [activeUpload, setActiveUpload] = useState(1)

  const next = () => {
    setActiveUpload(activeUpload + 1)
  }

  return (
    <AppContainer>
      {
        CSV_CONFIG.map((csvConfig) => {
          return (
            <Upload
              title={csvConfig.name}
              enabled={csvConfig.id <= activeUpload}
              next={next}
            />
          )
        })
      }
      {/* {
        activeUpload === CSV_CONFIG.length &&
          <Button>{'Upload'}</Button>
      } */}
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
