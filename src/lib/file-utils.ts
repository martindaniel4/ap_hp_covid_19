import { FilesIdType } from './types'
import { CSV_CONFIG } from './constants'

export function fileHasFieldsErrors(id: FilesIdType, fields: any) {
  const expectedFields = CSV_CONFIG[id]['fields']
  const missingFields = expectedFields.filter(x => !fields.includes(x))

  // je garde ca pour le moment afin de debugger plus facilement
  console.log(expectedFields)
  console.log(fields)
  console.log(missingFields)

  return missingFields.map(field => {
    return { message: `${field} est manquant` }
  })
}