import _ from 'underscore'

import { FilesIdType } from '../lib/types'
import { HOSPITAL_CODES_MAP } from '../lib/constants'
import { CSV_CONFIG } from '../lib/files-config'

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
  const siriusErrors = id === 'sirius' ? checkSirius(data) : []

  const allErrors = errors
    .concat(headerErrors)
    .concat(siriusErrors)

  return allErrors
}

export function checkRequiredFields(id: FilesIdType, fields: any) {
  const requiredFields = CSV_CONFIG[id]['requiredFields']
  const missingFields = requiredFields.filter(x => !fields.includes(x))
  
  return missingFields.map(field => { return { message: `${field} est manquant` } })
}

export function checkSirius(data) {
  const expectedCodes = Object.keys(HOSPITAL_CODES_MAP)
  const siriusCodes = _.chain(data).pluck('Hopital').uniq().value()
  const notSupportedCodes = siriusCodes.filter(x => !expectedCodes.includes(x))

  return notSupportedCodes.map(code => { return { message: `Le code hopital "${code}" n'est pas valide` } })
}