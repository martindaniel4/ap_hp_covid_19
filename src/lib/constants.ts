import { FilesDataType } from "./types"

export const GROUP_NAME = 'Groupe Hospitalier, Paris Saclay'
export const CHILD_ADULT_CUTOFF_AGE = 16

export const CSV_CONFIG: FilesDataType = {
  orbis: {
    id: 'orbis',
    name: 'ORBIS',
    description: 'Uploadez ici un export de la base ORBIS au format CSV. Les champs attendus sont: \n Né(e) le, IPP, N° Dossier, U.Responsabilité, U.Soins, Date d\'entrée du dossier, Date de sortie du dossier, Date de début du mouvement, Date de fin du mouvement, Chambre,Lit',
    fields: [],
    data: [],
    valid: false,
  },
  glims: {
    id: 'glims',
    name: 'GLIMS',
    description: 'Uploadez ici un export de la base GLIMS au format CSV. Les champs attendus sont: \n ipp, dt_deb_visite, dt_fin_visite, is_pcr, hop, last_uma',
    fields: [],
    data: [],
    valid: false,
  },
  pacs: {
    id: 'pacs',
    name: 'PACS',
    description: 'Uploadez ici un export de la base PACS au format CSV. Les champs attendus sont: \n ipp, date, radio',
    fields: [],
    data: [],
    valid: false,
  },
  capacity: {
    id: 'capacity',
    name: 'Capacitaire',
    description: 'Uploadez ici un mapping du capacitaire au format CSV. Les champs attendus sont: \n hopital, service_covid, lits_ouverts, lits_ouverts_covid, dedie_covid',
    fields: [],
    data: [],
    valid: false,
  },
  correspondance: {
    id: 'correspondance',
    name: 'SIRIUS',
    description: 'Uploadez ici un export de la base SIRIUS au format CSV. Les champs attendus sont: \n Hopital, Intitulé Site Crise COVID, Localisation CDG, Code Chambre, Retenir ligne O/N',
    fields: [],
    data: [],
    valid: false,
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
  '9': 'BCK',
  '10': 'BCT',
  '14': 'APR',
  '28': 'ABC',
  '68': 'RPC',
  '79': 'SPR',
  '96': 'PBR',
}

export const HOSPITAL_MAP = {
  'BCK': 'BERCK',
  'BCT': 'BICETRE',
  'PBR': 'PAUL-BROUSSE',
  'ABC': 'ANTOINE BECLERE',
  'SPR': 'SAINTE PERINE',
  'APR': 'AMBROISE PARE',
  'RPC': 'RAYMOND POINCARE',
}