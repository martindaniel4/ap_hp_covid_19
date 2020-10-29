import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'

import Files from './files/Files'
import Results from './results/Results'
import Section from './ui/Section'
import { FilesDataType, FileUploadPayloadType, ErrorType } from '../lib/types'
import { processFiles } from '../utils/processing-utils'
import { buildInitialStateFromFixture } from '../fixtures/fixtures-utils'

export default function APHP() {
  const initialState = buildInitialStateFromFixture(useLocation())
  const [files, setFiles] = useState<FilesDataType>(initialState)
  const [data, setData] = useState(null);

  // run only on component mount
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
      <NavSection>
        <NavContent>
          <Nav>{'Groupe Hospitalier, Paris Saclay'}</Nav>
          <SubNav>{'Suivi des patients Covid-19 et de capacité'}</SubNav>
        </NavContent>
      </NavSection>

      <Section outerBgColor={'#ffffff'}>
        <Files files={files} onUploadError={onUploadError} onUploadSuccess={onUploadSuccess} />
      </Section>
      
      {data && <Results filesData={data} />}
    </>
  )
}

const NavSection = styled.div`
  text-align: center;
  background: #0063af;
  color: white;
`

const NavContent = styled.div`
  width: 1200px;
  height: 70px;
  margin: 0 auto;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const Nav = styled.div`
  font-size: 30px;
  font-weight: bold;
`

const SubNav = styled.div`
  font-size: 20px;
`