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

  const warningsCount = _.values(warnings).filter(w => w.length > 0).length
  if (!warningsCount) return null

  return (
    <WarningsContainer>
      <Row>
        <WarningsContainerTitle>{`${warningsCount} Alertes`}</WarningsContainerTitle>
        <WarningToggle onClick={() => setIsExpanded(!isExpanded)}>{isExpanded ? '(Cacher les alertes)' : '(Montrer les alertes)'}</WarningToggle>
      </Row>
      {isExpanded && 
        <WarningContentWrapper>
          {Object.keys(warnings).map(warningKey => {
            if (warningKey === 'orbisWithNoRoom') return <OrbisWithNoRoomWarning key={warningKey} warningObject={warnings[warningKey]} />
            if (warningKey === 'orbisIsNewBorn') return <OrbisIsNewBornWarning key={warningKey} warningObject={warnings[warningKey]} />
            if (warningKey === 'siriusWithNoRoom') return <SiriusWithNoRoomWarning key={warningKey} warningObject={warnings[warningKey]} />
            if (warningKey === 'glimsRowsWithPCRNotValid') return <GlimsNotValidWarning key={warningKey} warningObject={warnings[warningKey]} />
            if (warningKey === 'pacsRowsWithRadioNotValid') return <PacsNotValidWarning key={warningKey} warningObject={warnings[warningKey]} />
            return null
          })}
        </WarningContentWrapper>
      }
    </WarningsContainer>
  )
}

function OrbisWithNoRoomWarning({ warningObject }: { warningObject: object[] }) {
  if (!warningObject.length) return null
  const warning_data = _.countBy(warningObject, d => d['U.Responsabilité'])
  console.log(warning_data);
  return (
    <BulletPoint>{`${warningObject.length} patients sans chambre dans Orbis`}</BulletPoint>
  )
}

function OrbisIsNewBornWarning({ warningObject }: { warningObject: object[] }) {
  if (!warningObject.length) return null
  return (
    <BulletPoint>{`${warningObject.length} nouveaux nés ont été décomptés des chambres occupées`}</BulletPoint>
  )
}

function SiriusWithNoRoomWarning({ warningObject }: { warningObject: object[] }) {
  if (!warningObject.length) return null
  return (
    <BulletPoint>{`${warningObject.length} patients qui ont une chambre dans Orbis mais pas de correspondance dans Sirius`}</BulletPoint>
  )
}

function GlimsNotValidWarning({ warningObject }: { warningObject: object[] }) {
  if (!warningObject.length) return null
  return (
    <BulletPoint>{`${warningObject.length} rangée(s) Glims où "is_pcr" n'est pas égal à "Positif"`}</BulletPoint>
  )
}

function PacsNotValidWarning({ warningObject }: { warningObject: object[] }) {
  if (!warningObject.length) return null
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