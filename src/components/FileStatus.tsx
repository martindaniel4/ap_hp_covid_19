import React from 'react'
import styled from 'styled-components'
import { Done, Error } from '@material-ui/icons'

import { FileType } from '../lib/types'

export default function FileStatus({csvConfig}: {csvConfig: FileType}) {
  const { data, errors } = csvConfig

  const hasData = data.length > 0
  const hasErrors = errors.length > 0

  if (!hasData && !hasErrors) return null
  if (hasData && !hasErrors) return <FileStatusSuccess csvConfig={csvConfig} />
  if (hasErrors) return <FileStatusError csvConfig={csvConfig} />
}

function FileStatusSuccess({csvConfig}: {csvConfig: FileType}) {
  const { fields, data, format } = csvConfig

  return (
    <SuccessContainer>
      <Row>
        <DoneIcon />
        <Summary>{`Fichier ${format} valide - ${data.length} rangées, ${fields.length} colonnes.`}</Summary>
      </Row>
    </SuccessContainer>
  )
}

function FileStatusError({csvConfig}: {csvConfig: FileType}) {
  const { errors } = csvConfig

  return (
    <ErrorsContainer>
      <Row>
        <ErrorIcon color={'secondary'} />
        <span>{`${errors.length} erreur(s):`}</span>
      </Row>
      <ErrorMessages>
        {errors.map(error => <div key={error.message}>{error.message}</div>)}
      </ErrorMessages>
    </ErrorsContainer>
  )
}

const Container = styled.div`
  margin-top: 6px;
  font-size: 12px;
`

const SuccessContainer = styled(Container)`
  color: green;
`

const ErrorsContainer = styled(Container)`
  color: #f50057;
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const Summary = styled.div``

const ErrorMessages = styled.div`
  margin-top: 6px;
  padding-left: 31px;
`

const ErrorIcon = styled(Error)`
  margin-right: 6px;
`

const DoneIcon = styled(Done)`
  margin-right: 6px;
`