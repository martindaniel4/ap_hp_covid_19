export type FilesIdType = 'orbis' | 'glims' | 'capacity' | 'pacs' | 'sirius'

export type FileUploadPayloadType = {
  id: FilesIdType,
  data: any[],
  format: string,
}

export type PapaParseResult = {
  data: any[],
  meta: {
    fields: any[],
  }
}

export type FileType = OrbisType | GlimsType | PacsType | CapacityType | SiriusType

export type FilesDataType = {
  orbis: OrbisType,
  glims: GlimsType,
  pacs: PacsType,
  capacity: CapacityType,
  sirius: SiriusType,
}

export type OrbisType = {
  id: 'orbis',
  name: string,
  description: string,
  errors: ErrorType[],
  fields: string[],
  data: OrbisFieldType[],
  format: string,
}

export type GlimsType = {
  id: 'glims',
  name: string,
  description: string,
  errors: ErrorType[],
  fields: string[],
  data: GlimsFieldType[],
  format: string,
}

export type PacsType = {
  id: 'pacs',
  name: string,
  description: string,
  errors: ErrorType[],
  fields: string[],
  data: PacsFieldType[],
  format: string,
}

export type CapacityType = {
  id: 'capacity',
  name: string,
  description: string,
  errors: ErrorType[],
  fields: string[],
  data: CapacityFieldType[],
  format: string,
}

export type SiriusType = {
  id: 'sirius',
  name: string,
  description: string,
  errors: ErrorType[],
  fields: string[],
  data: CapacityFieldType[],
  format: string,
}

export type ErrorType = {
  message: string
}

export type GlimsByIppType = {
  [ipp: string]: GlimsFieldType[]
}

export type PacsByIppType = {
  [ipp: string]: PacsFieldType[]
}

export type SiriusByCodeChambreType = {
  [codeChambre: string]: any,
}

export type PatientType = {
  "Date d'entrée du dossier": string,
  hospitalXYZ?: string,
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

export type PacsFieldType = {
  "ipp": string,
  "date": string,
  "radio": string,
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
  patientsCountCovid: number,
  lastPatientAdmittedOn: string,
  patientsCountPerDay: PatientsCountPerDayType,
  breakdownPerHospital: {
    [hospital: string]: {
      lastPatientAdmittedOn: string,
      patientsCountCovid: number,
      patientsCountPerDay: PatientsCountPerDayType,
      byService: {
        service: string,
        patientsCount: number,
        patientsCountCovid: number,
        covidRatio: string,
      }[],
    }
  },
}