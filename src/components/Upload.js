import React, { useState, useRef } from 'react'
import styled from 'styled-components'
import Papa from 'papaparse'

function Upload({ title, enabled, next }) {
  const [file, setFile] = useState(null)
  const [fields, setFields] = useState(null)
  const [data, setData] = useState(null)
  const fileInput = useRef(null)

  const analyzeCSV = (e) => {
    Papa.parse(e.target.files[0], {
      complete: updateData,
      header: true
    });

    setFile(e.target.files[0])
  }

  const updateData = (result) => {
    const { data, meta: { fields } } = result
    console.log(fields);
    console.log(data);

    setFields(fields)
    setData(data)
    next()
  }

  return (
    <UploadContainer enabled={enabled}>
      <Label>{title}</Label>
      <UploadWrapper>
        <>
          <Input
            id="file"
            type="file"
            name="file-input"
            ref={fileInput}
            accept=".csv"
            onChange={analyzeCSV}
          />
        </>
        {
          fields &&
            <>
              <div>{'This CSV headers are: '}</div>
              <CSVHeaders>{fields.join(', ')}</CSVHeaders>
            </>
        }
        {
          data &&
            <div>{`This CSV contains ${data.length} rows`}</div>
        }
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
  font-size: 16px;
  margin-bottom: 10px;
`

const UploadWrapper = styled.div`
  min-height: 80px;
  padding: 20px;
  font-size: 12px;
  border: dotted 3px #888;
  background-color: white;
  display: flex;
  flex-direction: column;
`

const Input = styled.input`
  margin-bottom: 10px;
`

const CSVHeaders = styled.div`
  font-weight: bold;
  margin-bottom: 10px;
`

export default Upload