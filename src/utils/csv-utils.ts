export function getCSVDataForDownload(capacityTableColumns, hospitalDataByService) {
  const headersLabels = capacityTableColumns.map(c => c['Header'])
  const headersAccessors = capacityTableColumns.map(c => c['accessor'])
  
  return [headersLabels].concat(hospitalDataByService.map(s => headersAccessors.map(h => s[h]) ))
}