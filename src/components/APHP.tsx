import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'

import Files from './files/Files'
import Results from './results/Results'
import { FilesDataType, FileUploadPayloadType, ErrorType } from '../lib/types'
import { processFiles } from '../lib/processing-utils'
import { buildInitialStateFromFixture } from '../fixtures/fixtures-utils'

export default function APHP() {
  const initialState = buildInitialStateFromFixture(useLocation())
  const [files, setFiles] = useState<FilesDataType>(initialState)
  const [data, setData] = useState(null)

  useEffect(() => {
    areAllFilesValid(files) && process(files)
  }, [])

  const areAllFilesValid = (filesOb: FilesDataType) => {
    return Object.values(filesOb).every(csv => csv.data && csv.data.length && csv.errors.length === 0)
  }

  const onUploadSuccess = (payload: FileUploadPayloadType) => {
    const { id, data, format } = payload
    const newFiles = {
      ...files,
      [id]: {
        ...files[id],
        data,
        errors: [],
        format
      },
    }
    setFiles(newFiles)
    areAllFilesValid(newFiles) && process(newFiles)
  }

  const onUploadError = ({
    id,
    errors
  }: {
    id: string,
    errors: ErrorType[]
  }) => {
    const newFiles = {
      ...files,
      [id]: {
        ...files[id],
        errors,
      },
    }
    setFiles(newFiles)
  }

  const process = (newFiles: FilesDataType) => {
    const data = processFiles(newFiles)
    setData(data)
  }

  return (
    <>
      <HeaderSection>
        <HeaderContent>
          <Header>{'Groupe Hospitalier, Paris Saclay'}</Header>
          <Subheader>{'Suivi des patients Covid-19 et de capacité'}</Subheader>
        </HeaderContent>
      </HeaderSection>
      <AppContainer>
        <Section>{`1) Uploader les ${Object.keys(files).length} fichiers`}</Section>
        <Files files={files} onUploadError={onUploadError} onUploadSuccess={onUploadSuccess} />
        <Section>{`2) Analyser les données`}</Section>
        {data && <Results filesData={data} />}
      </AppContainer>
    </>
  )
}

const AppContainer = styled.div`
  width: 1200px;
  margin: 0 auto 100px;
`;

const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 40px;
  background: #0063af;
  color: white;
`

const HeaderContent = styled.div`
  width: 1200px;
  height: 70px;
  margin: 0 auto;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const Header = styled.div`
  font-size: 30px;
  font-weight: bold;
`

const Subheader = styled.div`
  font-size: 20px;
`

const Section = styled.div`
  font-size: 32px;
  margin-bottom: 40px;
  font-weight: 800;
  padding: 12px 0;
  border-bottom: solid 4px #020202;
`