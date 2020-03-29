import React, { useState, useEffect } from 'react';
import styled from 'styled-components'
import { Divider } from '@material-ui/core'

import Upload from './Upload'

export default function UploadFiles({files, onFileComplete}) {
  return (
    <UploadContainer>
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
    </UploadContainer>
  )
}

const UploadContainer = styled.div`
  margin-bottom: 50px;
`