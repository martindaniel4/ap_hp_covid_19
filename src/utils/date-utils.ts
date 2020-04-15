import { getJsDateFromExcel } from "excel-date-to-js"
import moment from 'moment'

export function formatOrbisEntryDate(areOrbisDatesNumbers: boolean, date: number | string): string {
  if (!areOrbisDatesNumbers) return date.toString()
  return excelDateToJSDate(date)
}

// Note that this seems to work only for Excel spreadsheets made on PC.
// Dates are stored as numbers in Excel and count the number of days since January 0, 1900
// (1900 standard, for mac it is 1904, which means January 0, 1904 is the start date).
export function excelDateToJSDate(excelDate: number | string): string {
  const jsDate = getJsDateFromExcel(excelDate)  // 2016-05-20T00:00:00.000Z
  return moment(jsDate).format('DD/MM/YYYY')
}