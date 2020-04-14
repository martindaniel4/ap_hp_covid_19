import React, { useState } from 'react'
import styled from 'styled-components'
import _ from 'underscore'

import { WarningsType } from '../../lib/types'

export default function Warnings({
  warnings,
}: {
  warnings: WarningsType
}) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false)

  const hasWarnings = _.values(warnings).some(w => w.length > 0)
  if (!hasWarnings) return null

  return (
    <WarningsContainer>
      <Row>
        <WarningsContainerTitle>{'Alertes'}</WarningsContainerTitle>
        <WarningToggle onClick={() => setIsExpanded(!isExpanded)}>{isExpanded ? '(Cacher les alertes)' : '(Montrer les alertes)'}</WarningToggle>
      </Row>
      {isExpanded && 
        <WarningContentWrapper>
          {Object.keys(warnings).map(warningKey => {
            if (warningKey === 'patientsWithNoRoom') return <PatientsWithNoRoomWarning key={warningKey} warningObject={warnings[warningKey]} />
            if (warningKey === 'patientsWithNoHospital') return <PatientsWithNoHospitalWarning key={warningKey} warningObject={warnings[warningKey]} />
            if (warningKey === 'glimsRowsWithPCRNotValid') return <GlimsNotValidWarning key={warningKey} warningObject={warnings[warningKey]} />
            if (warningKey === 'pacsRowsWithRadioNotValid') return <PacsNotValidWarning key={warningKey} warningObject={warnings[warningKey]} />
            return null
          })}
        </WarningContentWrapper>
      }
    </WarningsContainer>
  )
}

function PatientsWithNoRoomWarning({ warningObject }: { warningObject: object[] }) {
  return (
    <BulletPoint>{`${warningObject.length} patients sans chambre`}</BulletPoint>
  )
}

function PatientsWithNoHospitalWarning({ warningObject }: { warningObject: object[] }) {
  return (
    <BulletPoint>{`${warningObject.length} patients sans hopital associé`}</BulletPoint>
  )
}

function GlimsNotValidWarning({ warningObject }: { warningObject: object[] }) {
  return (
    <BulletPoint>{`${warningObject.length} rangée(s) Glims où "is_pcr" n'est pas égal à "Positif"`}</BulletPoint>
  )
}

function PacsNotValidWarning({ warningObject }: { warningObject: object[] }) {
  return (
    <BulletPoint>{`${warningObject.length} rangée(s) Pacs où "radio" n'est pas égal à "1"`}</BulletPoint>
  )
}

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
`

const WarningsContainer = styled.div`
  color: rgb(97, 26, 21);
  background-color: rgb(253, 236, 234);
  padding: 15px 15px;
  margin-bottom: 30px;
  border-radius: 5px;
  border: solid 1px #ffb8b8;
`

const WarningsContainerTitle = styled.div`
  font-size: 16px;
  font-weight: bold;
  margin-right: 10px;
`

const WarningToggle = styled.div`
  font-size: 12px;
  cursor: pointer;
`

const WarningContentWrapper = styled.div`
  padding-left: 30px;
  font-size: 13px;
  margin-top: 10px;
`

const BulletPoint = styled.li`
  margin-botton: 4px;
`