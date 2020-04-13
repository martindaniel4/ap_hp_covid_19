import React from 'react';
import styled from 'styled-components'
import { Divider } from '@material-ui/core'

import Upload from './Upload'
import { FilesDataType } from '../lib/types';

export default function Files({
  files,
  onUploadSuccess,
  onUploadError,
}: {
  files: FilesDataType,
  onUploadSuccess: Function,
  onUploadError: Function
}) {
  return (
    <UploadContainer>
      {
        Object.keys(files).map(csvId =>
          <div key={csvId}>
            <Upload
              csvConfig={files[csvId]}
              onUploadSuccess={onUploadSuccess}
              onUploadError={onUploadError}
            />
            <Divider /> 
          </div>
        )
      }
    </UploadContainer>
  )
}

const UploadContainer = styled.div`
  margin-bottom: 100px;
`