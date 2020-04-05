export type FilesIdType = 'orbis' | 'glims' | 'capacity'

export type FileUploadPayloadType = {
  id: FilesIdType,
  fields: string[],
  data: any[],
}

export type PapaParseResult = {
  data: any[],
  meta: {
    fields: any[],
  }
}

export type FileType = OrbisType | GlimsType | CapacityType

export type FilesDataType = {
  orbis: OrbisType,
  glims: GlimsType,
  capacity: CapacityType,
}

export type OrbisType = {
  id: 'orbis',
  name: string,
  description: string,
  valid: boolean,
  fields: string[],
  data: OrbisFieldType[],
}

export type GlimsType = {
  id: 'glims',
  name: string,
  description: string,
  valid: boolean,
  fields: string[],
  data: GlimsFieldType[],
}

export type CapacityType = {
  id: 'capacity',
  name: string,
  description: string,
  valid: boolean,
  fields: string[],
  data: CapacityFieldType[],
}

export type GlimsByIppType = {
  [ipp: string]: GlimsFieldType[]
}

export type PatientType = {
  "Date d'entrée du dossier": string
}

export type OrbisFieldType = {
  "Sexe": string,
  "Né(e) le": string,
  "IPP": string,
  "N∞ Dossier": string,
  "U.ResponsabilitÈ": string,
  "U.Soins": string,
  "Date d'entrée du dossier": string,
  "Date de sortie du dossier": string,
  "Date de dÈbut du mouvement": string,
  "Date de fin du mouvement": string,
  "Chambre": string,
  "Lit": string,
}

export type GlimsFieldType = {
  "DOSSIER": string,
  "dt_deb_visite": string,
  "ipp": string,
  "RENS_PIH": string,
  "hop": string,
  "last_uma": string,
  "is_pcr": string,
  "dt_fin_visite": string,
}

export type CapacityFieldType = {
  "last_uma": string,
  "capacity": string,
}

export type PatientsCountPerDayType = {
  x: string,
  y: number
}[]

export type ProcessingResultsType = {
  currentCovidPatientsCount: number,
  lastPatientAdmittedOn: string,
  patientsCountPerDay: PatientsCountPerDayType,
  breakdownPerHospital: any,
}