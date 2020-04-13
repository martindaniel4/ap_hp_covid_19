export type FilesIdType = 'orbis' | 'glims' | 'capacity' | 'pacs' | 'sirius'

export type FileUploadPayloadType = {
  id: FilesIdType,
  data: OrbisFieldType[] | GlimsFieldType[] | PacsFieldType[] | CapacityFieldType[] | SiriusFieldType[],
  format: string,
}

export type PapaParseResult = {
  data: OrbisFieldType[] | GlimsFieldType[] | PacsFieldType[] | CapacityFieldType[] | SiriusFieldType[],
  meta: {
    fields: string[],
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
  requiredFields: string[],
  data: OrbisFieldType[],
  format: string,
}

export type GlimsType = {
  id: 'glims',
  name: string,
  description: string,
  errors: ErrorType[],
  requiredFields: string[],
  data: GlimsFieldType[],
  format: string,
}

export type PacsType = {
  id: 'pacs',
  name: string,
  description: string,
  errors: ErrorType[],
  requiredFields: string[],
  data: PacsFieldType[],
  format: string,
}

export type CapacityType = {
  id: 'capacity',
  name: string,
  description: string,
  errors: ErrorType[],
  requiredFields: string[],
  data: CapacityFieldType[],
  format: string,
}

export type SiriusType = {
  id: 'sirius',
  name: string,
  description: string,
  errors: ErrorType[],
  requiredFields: string[],
  data: SiriusFieldType[],
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

export type SiriusByChambreType = {
  [chambre: string]: SiriusFieldType[],
}

export type CapacityMapType = {
  [chambre: string]: CapacityFieldType[],
}

export type PatientType = {
  "IPP": string,
  "Date d'entrée du dossier": string,
  "Date de dÈbut du mouvement": string,
  "Date de fin du mouvement": string,
  "Date de sortie du dossier": string,
  "Chambre": string,
  "Lit": string,
  "Né(e) le": string,
  "N∞ Dossier": string,
  "Sexe": string,
  "U.ResponsabilitÈ": string,
  "U.Soins": string,
  "isCovid": boolean,
  "isPCR": boolean,
  "isRadio": boolean,
  "hospitalXYZ": string,
  "localisationCDGFromSirius": string,
  "siteCriseCovidFromSirius": string,
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

export type SiriusFieldType = {
  "Hopital": string,
  "Localisation": string,
  "Intitulé Site Crise COVID": string,
  "Code Chambre": string,
  "Libelle Chambre": string,
  "Retenir ligne O/N": string,
}

export type PatientsCountPerDayType = {
  x: string,
  y: number
}[]

export type ProcessingResultsType = {
  patientsCountCovid: number,
  lastPatientAdmittedOn: string,
  patientsCountPerDay: PatientsCountPerDayType,
  breakdownPerHospital: BreakdownPerHospitalType,
}

export type BreakdownPerHospitalType = {
  [hospital: string]: {
    lastPatientAdmittedOn: string,
    patientsCountCovid: number,
    patientsCountPerDay: PatientsCountPerDayType,
    byService: ServiceDataType[],
  }
}

export type ServiceDataType = {
  serviceName: string,
  patientsCount: number,
  patientsCountCovid: number,
  patientsCountPCR: number,
  patientsCountRadio: number,
  capacityTotal: string,
  capacityCovid: string,
  openBeds: number,
}