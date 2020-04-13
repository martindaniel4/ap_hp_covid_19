import queryString from 'query-string'

import { CSV_CONFIG } from '../lib/constants'
import orbisFixture from './orbis_fixture'
import glimsFixture from './glims_fixture'
import pacsFixture from './pacs_fixture'
import capacityFixture from './capacity_fixture'
import siriusFixture from './sirius_fixture'
import { FilesDataType, FilesIdType } from '../lib/types'

const FIXTURES_DATA = {
  orbis: orbisFixture,
  glims: glimsFixture,
  pacs: pacsFixture,
  capacity: capacityFixture,
  sirius: siriusFixture,
}

export function buildInitialStateFromFixture(location: any): FilesDataType {
  const queryStrings = queryString.parse(location.search)
  const useFixture = queryStrings['fixture'] === 'on'

  if (!useFixture) return CSV_CONFIG

  let initialState = CSV_CONFIG

  Object.keys(CSV_CONFIG).forEach((fileId: FilesIdType) => {
    initialState[fileId]['data'] = FIXTURES_DATA[fileId]
  })

  return initialState
}