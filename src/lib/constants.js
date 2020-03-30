export const GROUP_NAME = 'Groupe Hospitalier, Paris Saclay'
export const CHILD_ADULT_CUTOFF_AGE = 16

export const CSV_CONFIG = {
  'orbis': {
    id: 'orbis',
    name: 'Orbis',
    description: 'Uploadez ici un export de la base Orbis au format CSV. Les champs attendus sont: \n Né(e) le, IPP, N° Dossier, U.Responsabilité, U.Soins, Date d\'entrée du dossier, Date de sortie du dossier, Date de début du mouvement, Date de fin du mouvement, Chambre,Lit',
  },
  'glims': {
    id: 'glims',
    name: 'Glims',
    description: 'Uploadez ici un export de la base Glims au format CSV. Les champs attendus sont: \n ipp, dt_deb_visite, dt_fin_visite, is_pcr, hop, last_uma',
  },
  'capacity': {
    id: 'capacity',
    name: 'Capacitaire',
    description: 'Uploadez ici un mapping du capacitaire au format CSV. Les champs attendus sont: \n last_uma, capacity',
  }
}

export const capacityTableColumns = [
  {
    Header: 'Unité de Soin',
    accessor: 'service'
  },
  {
    Header: 'Patients',
    accessor: 'currentPatientsCount'
  },
  {
    Header: 'Adultes',
    accessor: 'currentPatientsCountAdult'
  },
  {
    Header: 'Enfants',
    accessor: 'currentPatientsCountChild'
  },
  {
    Header: 'Capacitaire ouvert COVID +',
    accessor: 'serviceCapacity'
  },
  {
    Header: 'Nombre de lits disponibles',
    accessor: 'availableBeds'
  }
]