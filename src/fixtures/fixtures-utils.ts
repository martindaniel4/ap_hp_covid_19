import { CSV_CONFIG } from '../lib/constants'
import { FILES_DATA_FIXTURE } from './data_fixture'
import { FilesDataType, FilesIdType } from '../lib/types'

export function buildInitialStateFromFixture(useFixture: boolean): FilesDataType {
  if (!useFixture) return CSV_CONFIG

  let initialState = CSV_CONFIG

  Object.keys(CSV_CONFIG).forEach((fileId: FilesIdType) => {
    initialState[fileId]['data'] = FILES_DATA_FIXTURE[fileId].data
  })

  return initialState
}