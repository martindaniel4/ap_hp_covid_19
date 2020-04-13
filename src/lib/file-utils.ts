import { FilesIdType } from './types'
import { CSV_CONFIG } from './constants'

export function checkFileForErrors({
  id,
  fields,
  data,
}: {
  id: FilesIdType,
  fields: string[],
  data: any[],
}) {
  let errors = []

  const headerErrors = checkRequiredFields(id, fields)
  const siriusErrors = id === 'sirius' && checkSirius(data)

  return errors
    .concat(headerErrors)
    .concat(siriusErrors)
}

export function checkRequiredFields(id: FilesIdType, fields: any) {
  const requiredFields = CSV_CONFIG[id]['requiredFields']
  const missingFields = requiredFields.filter(x => !fields.includes(x))
  const headerErrors = missingFields.map(field => { return { message: `${field} est manquant` } })
  return headerErrors
}

export function checkSirius(data) {
  console.log(data)
  return []
}