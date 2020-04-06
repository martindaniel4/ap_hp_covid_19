import { FilesDataType } from "./types"

export const GROUP_NAME = 'Groupe Hospitalier, Paris Saclay'
export const CHILD_ADULT_CUTOFF_AGE = 16

export const CSV_CONFIG: FilesDataType = {
  orbis: {
    id: 'orbis',
    name: 'Orbis',
    description: 'Uploadez ici un export de la base Orbis au format CSV. Les champs attendus sont: \n Né(e) le, IPP, N° Dossier, U.Responsabilité, U.Soins, Date d\'entrée du dossier, Date de sortie du dossier, Date de début du mouvement, Date de fin du mouvement, Chambre,Lit',
    fields: [],
    data: [],
    valid: false,
  },
  glims: {
    id: 'glims',
    name: 'Glims',
    description: 'Uploadez ici un export de la base Glims au format CSV. Les champs attendus sont: \n ipp, dt_deb_visite, dt_fin_visite, is_pcr, hop, last_uma',
    fields: [],
    data: [],
    valid: false,
  },
  pacs: {
    id: 'pacs',
    name: 'Pacs',
    description: 'Uploadez ici un export de la base Pacs au format CSV. Les champs attendus sont: \n ipp, date, radio',
    fields: [],
    data: [],
    valid: false,
  },
  capacity: {
    id: 'capacity',
    name: 'Capacitaire',
    description: 'Uploadez ici un mapping du capacitaire au format CSV. Les champs attendus sont: \n last_uma, capacity',
    fields: [],
    data: [],
    valid: false,
  }
}

export const capacityTableColumns = [
  {
    Header: 'Unité de Soin',
    accessor: 'service',
  },
  {
    Header: 'Total Patients',
    accessor: 'patientsCount',
  },
  {
    Header: 'Covid19 Positifs',
    accessor: 'patientsCountCovid',
  },
  {
    Header: 'Taux de Covid19 Positifs',
    accessor: 'covidRatio',
  },
]

export const HOSPITAL_MAP = {
  'BCT': 'BICETRE',
  'PBR': 'PAUL-BROUSSE',
  'ABC': 'ANTOINE BECLERE',
  'SPR': 'SAINTE PERINE',
  'APR': 'AMBROISE PARE',
  'RPC': 'RAYMOND POINCARE',
}