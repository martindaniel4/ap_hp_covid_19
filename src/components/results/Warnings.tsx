import React, { useState } from 'react'
import styled from 'styled-components'
import _ from 'underscore'

import { WarningsType } from '../../lib/types'

export default function Warnings({
  warnings,
}: {
  warnings: WarningsType
}) {
  const [isExpanded, setIsExpanded] = useState<boolean>(true)

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
            if (warningKey === 'isSivicRetrait') return <SivicRetraitWarning key={warningKey} warningObject={warnings[warningKey]} />
            return null
          })}
        </WarningContentWrapper>
      }
    </WarningsContainer>
  )
}

function OrbisWithNoRoomWarning({ warningObject }: { warningObject: object[] }) {
  if (!warningObject.length) return null
  
  const noRoomsUnitsList = _.chain(warningObject)
    .countBy(d => d['U.Responsabilité'].split(' - ')[1])
    .pairs()
    .value()
                      
  return (
    <BulletPoint>
      {`${warningObject.length} patients n'ont pas de chambre dans Orbis au sein des unités suivantes: `}
      <ServiceNames>
        {noRoomsUnitsList.map(service => {
          return (
            <ServiceName key={service[0]}>
              {service[0]}
              {' - '}
              <span style={{ fontWeight: 600 }}>{`${service[1]} patient(s)`}</span>
            </ServiceName>
          )
        })}
      </ServiceNames>
    </BulletPoint>
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
    <BulletPoint>{`Les chambres suivantes n'ont pas de correspondance dans Sirius: ${_.pluck(warningObject, 'Chambre')}. ${warningObject.length} patients sont couchés dans ces chambres.`}</BulletPoint>
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

function SivicRetraitWarning({ warningObject }: { warningObject: object[] }) {
  if (!warningObject.length) return null
  return (
    <BulletPoint>
      {`${warningObject.length} ont été exclus des rapports Glims et Pacs suite à vérification par l'équipe qualité`}
      <ServiceNames>
        {warningObject.map(row => {
          return (
            <ServiceName key={row[0]}>
              {row["IPP"]}
            </ServiceName>
          )
        })}
      </ServiceNames>
    </BulletPoint>
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
  margin-bottom: 6px;
`

const ServiceNames = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 8px 0 0 20px;
`

const ServiceName = styled.div`
  background-color: white;
  padding: 2px 4px;
  margin: 0 5px 5px 0;
  font-style: italic;
`