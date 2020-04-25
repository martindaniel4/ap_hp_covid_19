export const columnsForHospitalTable = [
  {
    Header: 'Site',
    accessor: 'hospitalXYZ',
  },
  {
    Header: 'Site crise Covid-19',
    accessor: 'serviceName',
  },
  {
    Header: 'Localisation',
    accessor: 'localisation',
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