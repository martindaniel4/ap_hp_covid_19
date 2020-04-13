import { FilesIdType } from './types'
import { CSV_CONFIG } from './constants'

export function checkFileForErrors({
  id,
  fields,
  data,
}: {
  id: FilesIdType,
  data: any[],
  fields: string[],
}) {
  let errors = []

  const headerErrors = checkFileForRequiredFields(id, fields)

  return errors.concat(headerErrors)
}

export function checkFileForRequiredFields(id: FilesIdType, fields: any) {
  const requiredFields = CSV_CONFIG[id]['requiredFields']
  const missingFields = requiredFields.filter(x => !fields.includes(x))
  const headerErrors = missingFields.map(field => { return { message: `${field} est manquant` } })
  return headerErrors
}