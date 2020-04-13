import { FilesDataType } from "./types"

export const GROUP_NAME = 'Groupe Hospitalier, Paris Saclay'
export const CHILD_ADULT_CUTOFF_AGE = 16

export const CSV_CONFIG: FilesDataType = {
  orbis: {
    id: 'orbis',
    name: 'ORBIS',
    description: 'Uploadez ici un export de la base ORBIS au format CSV ou XLSX.',
    fields: [
      "IPP",
      "U.Responsabilité",
      "U.Soins",
      "Date d'entrée du dossier",
      "Chambre",
      "Lit",
    ],
    data: [],
    errors: [],
    format: '',
  },
  glims: {
    id: 'glims',
    name: 'GLIMS',
    description: 'Uploadez ici un export de la base GLIMS au format CSV ou XLSX.',
    fields: [
      'DOSSIER',
      'PRLVT',
      'ipp',
      'RENS_PIH',
      'is_pcr',
    ],
    data: [],
    errors: [],
    format: '',
  },
  pacs: {
    id: 'pacs',
    name: 'PACS',
    description: 'Uploadez ici un export de la base PACS au format CSV ou XLSX.',
    fields: [
      "ipp",
      "date",
      "radio",
    ],
    data: [],
    errors: [],
    format: '',
  },
  capacity: {
    id: 'capacity',
    name: 'Capacitaire',
    description: 'Uploadez ici un mapping du capacitaire au format CSV ou XLSX.',
    fields: [
      "hopital",
      "service_covid",
      "lits_ouverts",
      "lits_ouverts_covid",
      "Full COVID 1/0",
    ],
    data: [],
    errors: [],
    format: '',
  },
  sirius: {
    id: 'sirius',
    name: 'SIRIUS',
    description: 'Uploadez ici un export de la base SIRIUS au format CSV ou XLSX.',
    fields: [],
    data: [],
    errors: [],
    format: '',
  },
}

export const capacityTableColumns = [
  {
    Header: 'Site crise Covid-19',
    accessor: 'service',
  },
  {
    Header: 'Nombre de lits ouverts',
    accessor: 'capacityTotal',
  },
  {
    Header: 'Nombre de lits ouverts Covid',
    accessor: 'capacityCovid',
  },
  {
    Header: 'Total patients',
    accessor: 'patientsCount',
  },
  {
    Header: 'Total patients Covid',
    accessor: 'patientsCountCovid',
  },
  {
    Header: 'Patients Covid-19+ biologie',
    accessor: 'patientsCountPCR',
  },
  {
    Header: 'Patients Covid-19+ radiologie',
    accessor: 'patientsCountRadio',
  },
  {
    Header: 'Nombre de lits disponibles',
    accessor: 'openBeds',
  },
]

export const HOSPITAL_CODES_MAP = {
  '9': 'BRK',
  '10': 'BCT',
  '14': 'APR',
  '28': 'ABC',
  '68': 'RPC',
  '79': 'SPR',
  '96': 'PBR',
}

export const HOSPITAL_MAP = {
  'BRK': 'BERCK',
  'BCT': 'BICETRE',
  'PBR': 'PAUL-BROUSSE',
  'ABC': 'ANTOINE BECLERE',
  'SPR': 'SAINTE PERINE',
  'APR': 'AMBROISE PARE',
  'RPC': 'RAYMOND POINCARE',
}