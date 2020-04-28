import React from 'react';
import { Divider } from '@material-ui/core'

import Upload from './Upload'
import { FilesDataType } from '../../lib/types';

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
    <>
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
    </>
  )
}