import { FilesIdType } from './types'
import { CSV_CONFIG } from './constants'

export function fileHasFieldsErrors(id: FilesIdType, fields: any) {
  const requiredFields = CSV_CONFIG[id]['requiredFields']
  const missingFields = requiredFields.filter(x => !fields.includes(x))

  // je garde ca pour le moment afin de debugger plus facilement
  // console.log(requiredFields)
  // console.log(fields)
  // console.log(missingFields)

  return missingFields.map(field => {
    return { message: `${field} est manquant` }
  })
}