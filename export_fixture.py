import json
import pandas as pd

# deactivate warnings for chaining
pd.options.mode.chained_assignment = None

# Orbis

orbis = pd.read_excel('data/valide/orbis.xlsx',
                      converters={'IPP': str,
                                  'U.Responsabilité': str, 
                                  'U.Soins': str,
                                  'Chambre': str,
                                  'Lit': str},
                      parse_dates=[7])

print('initial orbis shape {}'.format(orbis.shape))

# Extract hospital name from U.Responsabilité (e.g: ABC from 028081 - ABC OBSTETRIQUE (UF))
orbis['hospital_name'] =\
    orbis['U.Responsabilité'].str.split(r"\ - ", expand=True)[1].str[0:3]
# format date
orbis['Date d\'entrée du dossier'] =\
    orbis['Date d\'entrée du dossier'].dt.strftime('%d/%m%/%Y')

# only filter hospital ABC
orbis = orbis.query("hospital_name == 'ABC'")

# select relevant columns
orbis_cols = ['IPP', 'U.Responsabilité', 'U.Soins', 
              'Date d\'entrée du dossier', 'Chambre', 'Lit', 'Né(e) le']
orbis = orbis[orbis_cols]

print('new orbis shape {}'.format(orbis.shape))

# export. Note you might need to find replace '\/' by '/' as pandas enclose / 
# characters in the dates
with open('orbis_fixture.json', 'w', encoding='utf-8') as f:
     f.write(orbis.to_json(orient='records', force_ascii=False))

# rename column ipp for future merge
orbis.rename(columns={'IPP': 'ipp'}, inplace=True)

# Glims - only export pcr from ABC hospital

glims = pd.read_excel('data/valide/glims.xlsx',
                      converters={'ipp': str, 'Code Chambre': str})

print('initial glims shape {}'.format(glims.shape))

glims_cols = ['ipp', 'is_pcr']
glims = pd.merge(glims, orbis)[glims_cols]

print('new glims shape {}'.format(glims.shape))

# export to json
with open('glims_fixture.json', 'w', encoding='utf-8') as f:
     f.write(glims.to_json(orient='records', force_ascii=False))

# Sirius

sirius = pd.read_excel('data/valide/sirius.xlsx',
                       converters={'Hopital': str, 'Code Chambre': str})

print('initial sirius shape {}'.format(sirius.shape))

# Only filter relevant rows
sirius = sirius[sirius['Retenir ligne O/N']=='OUI']

# Only filter rows that match a room in ABC hospital 

# First- Extract code chambre from chambre (e.g: C134 from C134 - CHAMBRE SEULE C134)
orbis['code_room'] = orbis['Chambre'].str.split(r"\ - ", expand=True)[0]

# Second - merge Orbis and Sirius on Code Chambre and drop_duplicates
sirius = pd.merge(orbis,
                  sirius,
                  left_on='code_room',
                  right_on='Code Chambre')\
           .drop_duplicates(['Hopital', 'Intitulé Site Crise COVID', 'Code Chambre', 'Libelle Chambre'])

# Export only relevant columns

sirius_cols = ['Hopital', 'Intitulé Site Crise COVID', 
               'Code Chambre', 'Libelle Chambre', 'Retenir ligne O/N']

sirius = sirius[sirius_cols]

print('new sirius shape {}'.format(sirius.shape))

# export to json
with open('sirius_fixture.json', 'w', encoding='utf-8') as f:
     f.write(sirius.to_json(orient='records', force_ascii=False))