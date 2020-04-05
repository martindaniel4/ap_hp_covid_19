## Context 

This app aims at displaying the remaining bed capacity for Covid-19 patients in the Groupe Hospitalier Paris Saclay of AP-HP. More details are available in [this one-pager](https://docs.google.com/document/d/1sQ_swM_F5y89ie4gtzpCp83kPZfTcFir_y2GxO1ZG8o/edit).

See app online at - https://ap-hp-paris-saclay.herokuapp.com/

## Input

The app takes 5 distinct files as input `orbis.csv`, `glims.csv`, `pacs.csv`,  `capacity.csv` and `correspodance.csv`. 

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
lits|INT|Number of beds available for that service_covid. 
full_covid|BOOLEAN|whether the service is full covid or not. 


- `Correspondance`: Mapping between Orbis sub-unit and the Covid service put together by the hospital. 

hopital,service_covid,U.Soins

Column|Type|Description
---|---|---
hopital|STRING|Name of hospital. 
service_covid|STRING|Name of the Covid-19 service as defined by the hospital. 
U.Soins|STRING|Sub-unit name from the hospital. That field matches Orbis corresponding field

## Output 

The output is a table that gives, for each hospital the following: 

Text displayed|Column|Type|Description
---|---|---|---
Service Covid-19|service_covid|STRING|Name of the Covid-19 service as defined by the hospital. Field from the Correspondance table. 
Nombre de lits|lits|INT|Number of beds available for that service_covid (from the file capacitaire.csv).
Total patients|total_patients|INT|Total number of patients for that service_covid. This field is computed by summing patients in the corresponding Orbis sub-units. 
Nombre de lits restants|remaining_beds|INT|Remaining number of beds for that service_covid. Equal to lits - total_patients. 
Patients Covid-19+ biologie|glims_patients_covid|INT|Total number of patients for that service_covid that are positive according to Glims.
Patients Covid-19+ radiologie|pacs_patients_covid|INT|Total number of patients for that service_covid that are positive according to Pacs.
Patients Covid-19+ (autres)|other_patients_covid|INT|Number of patients for that service that are Covid-19 due to the fact that the service is dedicated to Covid-19 patients.

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