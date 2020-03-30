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
  // 'capacity': {
  //   id: 'capacity',
  //   name: 'Capacity',
  //   description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a',
  // }
}