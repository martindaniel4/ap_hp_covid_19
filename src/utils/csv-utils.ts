import _ from 'underscore'

export function getCSVDataForDownload(
  capacityTableColumns,
  hospitalDataByService
) {
  const headersLabels = capacityTableColumns.map(c => c['Header'])
  const headersAccessors = capacityTableColumns.map(c => c['accessor'])

  // we're sorting by hospital first and then by service name
  const sortedData = _.sortBy(hospitalDataByService, row => `${row['hospitalXYZ']} - ${row['serviceName']}`)

  return [headersLabels].concat(sortedData.map(s => headersAccessors.map(h => s[h]) ))
}