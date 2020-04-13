import { FilesIdType } from './types'
import { CSV_CONFIG } from './constants'

export function checkFileForErrors(id: FilesIdType, fields: any) {
  let errors = []

  const requiredFields = CSV_CONFIG[id]['requiredFields']
  const missingFields = requiredFields.filter(x => !fields.includes(x))
  const headerErrors = missingFields.map(field => { return { message: `${field} est manquant` } })
  errors = errors.concat(headerErrors)

  console.log(errors)

  return errors
}