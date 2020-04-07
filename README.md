## Context 

This app aims at displaying the remaining bed capacity for Covid-19 patients in the Groupe Hospitalier Paris Saclay of AP-HP. More details are available in [this one-pager](https://docs.google.com/document/d/1sQ_swM_F5y89ie4gtzpCp83kPZfTcFir_y2GxO1ZG8o/edit).

See app online at - https://ap-hp-paris-saclay.herokuapp.com/

## Input

The app takes 5 distinct files as input `orbis.csv`, `glims.csv`, `pacs.csv`,  `capacity.csv` and `correspondance.csv`. 

Below are more details and specified schema for each file. Each of those should be inputed as UTF-8 csv. You can also find under the `csv` folder, 5 template files 

- `Orbis`: this is a snapshot of the current patients admitted in the hospital. 


Column|Type|Description
---|---|---
Sexe|STRING|Sex of patient
Né(e) le|DATE|Date of birth, format DD/MM/YYYY
IPP|INT|Patient id.
N∞ Dossier|INT|Case number. 
U.ResponsabilitÈ|STRING| Unit name (e.g: 010250 - BCT SRPR (UF))
U.Soins|STRING| Sub-unit name (e.g: 010780NE5 - BCT HC SSR NEUROLOGIE - CULLERIER)
Date d'entrée du dossier|DATE| Entry date of patient, format DD/MM/YYYY HH:MM
Date de sortie du dossier|DATE| Exit date of patient, format  DD/MM/YYYY HH:MM
Date de dÈbut du mouvement|DATE| Datetime when a patient is moved to a room or service, format  DD/MM/YYYY HH:MM.
Date de fin du mouvement|DATE|End date when a patient is moved from a unit, format  DD/MM/YYYY HH:MM.
Chambre|STRING|Room where the patient is located in (e.g: N515 - CULLERIER CHAMBRE 15 DOUBLE)
Lit|STRING|Bed where the patient is located in (e.g: N515P - LIT 15 PORTE)


- `Glims`: Export of serology tests of patients that indicates whether patients are tested positive to Covid-19. Note that there may be multiple rows for a same patient. Not all rows match an Orbis patient. For instance medical staff may appear in the Glims export. 


|Column|Type|Description|
|---|---|---|
|DOSSIER|INT|Case number|
|dt_deb_visite|DATE|Date of the test. Format is DD/MM/YYYY.|
|ipp|INT|Patient id.|
|RENS_PIH|INT|Id. Unkwown entity.|
|hop|STRING| Name of the hospital where the test was run.|
|last_uma|STRING|Last unit visited by patient.|
|is_pcr|STRING|Indicates if the patient is tested positive to Covid-19.|
|dt_fin_visite|DATE|Date of end of visit.|


- `Pacs`: Export of lung radiology scans. Indicates whether patients are tested positive to Covid-19.

Column|Type|Description
---|---|---
ipp|INT|Patient id. 
date|DATE|Date of the test. Format is DD/MM/YYYY.
radio|STRING|Indicates if the patient is tested positive to Covid-19. 

- `Capacitaire`: Daily snapshot of the bed capacity in a given hospital. 

Column|Type|Description
---|---|---
hopital|STRING|Name of hospital. 
service_covid|STRING|Name of the Covid service as defined by the hospital. 
lits_ouverts|INT|Number of beds available for that service.
lits_ouverts_covid|INT|Number of beds available for that service dedicated to Covid patients.
dedie_covid|INT|1 if dedicated to Covid, else 0.


- `Correspondance`: Sirius extract enabling mapping between Orbis room code and the Covid service put together by the hospital. 

Column|Type|Description
---|---|---
Hopital|INT|Code of hospital (e.g.: 96). 
Localisation CDG|STRING|Returns the physical location of the room (e.g: BATIMENT COMMANDANT RIVIERE  NIVEAU 2).
Intitulé Site Crise COVID|STRING|Our "service_covid" field, name of the Covid service as defined by the hospital (e.g.: PSY J. DELAY).
Code Chambre|STRING|The room code, unique per hospital, to use to match with Orbis.
Retenir ligne O/N|STRING|"OUI" if the room should be included in the tablem, "NON" otherwise.

Unused so far: `type chambre, commentaires, Code Site, Libelle Site, Date de création, Date de modification, Date d'effet creation, Date de fin de validité, Date d'effet modification, Code Batiment, Libelle Batiment, Date de création, Date de modification, Date d'effet creation, Date de fin de validité, Date d'effet modification, Code Secteur Batiment, Libelle Secteur Batiment, Date de création, Date de modification, Date d'effet creation, Date de fin de validité, Date d'effet modification, Code Etage, Libelle Etage, Date de création, Date de modification, Date d'effet creation, Date de fin de validité, Date d'effet modification, Libelle Chambre, Date de création, Date de modification, Date d'effet creation, Date de fin de validité, Date d'effet modification`

## Output 

The output is a table that gives, for each hospital the following: 

Text displayed|Column|Type|Description
---|---|---|---
Site crise Covid-19|service_covid|STRING|Name of the Covid-19 service as defined by the hospital. Field from the Correspondance table. 
Nombre de lits ouverts|lits_ouverts|INT|Number of beds available for that service_covid (from the file capacitaire.csv).
Nombre de lits dédiés Covid|lits_ouverts_covid|INT|Number of beds available for that service_covid and dedicated to Covid patients (from the file capacitaire.csv).
Total patients|total_patients|INT|Total number of for that service_covid. This field is computed from Orbis. 
Total patients Covid|total_patients_covid|INT|Total number of Covid patients for that service_covid. This field is computed by summing Covid patients (glims + pacs + other).
Patients Covid-19+ biologie|glims_patients_covid|INT|Total number of patients for that service_covid that are positive according to Glims.
Patients Covid-19+ radiologie|pacs_patients_covid|INT|Total number of patients for that service_covid that are positive according to Pacs.
Patients Covid-19+ (autres)|orbis_patients_covid|INT|Number of patients for that service that are Covid-19 from the dedicated field in Orbis.
Nombre de lits disponibles|remaining_beds|INT|Remaining number of beds for Covid patients for that service_covid. Equal to lits_ouverts - total_patients. 


## Run in dev

```
yarn
yarn start
```

## Deploy

- Add heroku origin to the git repo 

```
git remote add heroku https://git.heroku.com/ap-hp-paris-saclay.git
```

- Push to Heroku Master

```
git push heroku master
```
