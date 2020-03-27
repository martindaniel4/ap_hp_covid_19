import React, { useState, useRef } from 'react'
import styled from 'styled-components'
import Papa from 'papaparse'

function Upload({ csvConfig, enabled, onFileComplete }) {
  const fileInput = useRef(null)
  
  const analyzeCSV = (e) => {
    Papa.parse(e.target.files[0], {
      complete: updateData,
      header: true
    });
  }

  const updateData = (result) => {
    const { id } = csvConfig
    const { data, meta: { fields } } = result

    onFileComplete({
      id,
      fields,
      data,
    })
  }

  return (
    <UploadContainer enabled={enabled}>
      <Label>{csvConfig.name}</Label>
      <Description>{csvConfig.description}</Description>
      <UploadWrapper>
        <>
          <Input
            id="file"
            type="file"
            name={csvConfig.id}
            ref={fileInput}
            accept=".csv"
            onChange={analyzeCSV}
          />
        </>
      </UploadWrapper>
    </UploadContainer>
  )
}

const UploadContainer = styled.div`
  margin-bottom: 50px;

  ${({ enabled }) => !enabled && `
    opacity: 0.3;
  `}
`

const Label = styled.div`
  font-weight: bold;
  font-size: 20px;
  margin-bottom: 10px;
`

const Description = styled.div`
  font-size: 12px;
  margin-bottom: 10px;
`

const UploadWrapper = styled.div`
  // min-height: 80px;
  // padding: 20px;
  // font-size: 12px;
  // border: dotted 3px #888;
  // background-color: white;
  // display: flex;
  // flex-direction: column;
`

const Input = styled.input`
  margin-bottom: 10px;
`

const CSVHeaders = styled.div`
  font-weight: bold;
  margin-bottom: 10px;
`

export default Upload