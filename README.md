# AP-HP Covid-19 Bed Capacity Tracker 

## Summary 

- <a href="#context">Context</a>
- <a href="#input">Input</a>
- <a href="#logic">Logic</a>
- <a href="#output">Output</a>
- <a href="#app">Application</a>
- <a href="#data-exploration">Data Exploration</a>

<div id="context">

## Context

This app aims at displaying the remaining bed capacity for Covid-19 patients in the Groupe Hospitalier Paris Saclay of AP-HP. More details are available in [this one-pager](https://docs.google.com/document/d/1sQ_swM_F5y89ie4gtzpCp83kPZfTcFir_y2GxO1ZG8o/edit).

See app online at - https://ap-hp-paris-saclay.herokuapp.com/

<div id="input">

## Input

The app takes 6 distinct files as input `orbis`, `glims`, `pacs`,  `capacity`, `sirius` and `sivic`. 

Each of those files are exported from one of the information system of AP-HP. Files types are specificed below. You can also find under the `data` folder an up to date sample of each file. 

*Input format files*

File|Type|Encoding|Team
---|---|---|---
Orbis|csv (sep=;)|cp1252|Finance|-
Glims|xlsx|-|Finance|-
Pacs|xlsx|-|Radio|-
Sirius|xlsx|-|Accounting
Capacitaire|xlsx|-|Finance
Sivic|xlsx|-|Qualite

*Input files description*

- [`Orbis`](#orbis): this is a snapshot of the current patients admitted in the hospital. 

Column|Type|Description
---|---|---
Sexe|STRING|Sex of patient
Né(e) le|DATE|Date of birth, format DD/MM/YYYY
IPP|INT|Patient id.
N° Dossier|INT|Case number. 
U.Responsabilité|STRING| Unit name (e.g: 010250 - BCT SRPR (UF))
U.Soins|STRING| Sub-unit name (e.g: 010780NE5 - BCT HC SSR NEUROLOGIE - CULLERIER)
Date d'entrée du dossier|DATE| Entry date of patient, format DD/MM/YYYY HH:MM
Date de sortie du dossier|DATE| Exit date of patient, format  DD/MM/YYYY HH:MM
Date de début du mouvement|DATE| Datetime when a patient is moved to a room or service, format  DD/MM/YYYY HH:MM.
Date de fin du mouvement|DATE|End date when a patient is moved from a unit, format  DD/MM/YYYY HH:MM.
Chambre|STRING|Room where the patient is located in (e.g: N515 - CULLERIER CHAMBRE 15 DOUBLE)
Lit|STRING|Bed where the patient is located in (e.g: N515P - LIT 15 PORTE)


- [`Glims`](#glims): Export of serology tests of patients that indicates whether patients are tested positive to Covid-19. Note that there may be multiple rows for a same patient. Not all rows match an Orbis patient. For instance medical staff may appear in the Glims export. 


|Column|Type|Description|
|---|---|---|
|DOSSIER|INT|Case number|
|PRLVT|DATE|Date of the test. Format is DD/MM/YYYY.|
|ipp|INT|Patient id.|
|RENS_PIH|STRING| Name of the hospital where the test was conducted.|
|last_uma|STRING|Last unit visited by patient.|
|is_pcr|STRING|Indicates if the patient is tested positive to Covid-19.|


- [`Pacs`](#pacs): Export of lung radiology scans. Indicates whether patients are tested positive to Covid-19.

Column|Type|Description
---|---|---
ipp|INT|Patient id. 
date|DATE|Date of the test. Format is DD/MM/YYYY.
radio|INT| 1 if the patient is Covid-19 positive from radiology.

- [`Capacitaire`](#capacitaire): Daily snapshot of the bed capacity in a given hospital. 

Column|Type|Description
---|---|---
hopital|STRING|Name of hospital. 
service_covid|STRING|Name of the Covid service as defined by the hospital. 
lits_ouverts|INT|Number of beds available for that service.
lits_ouverts_covid|INT|Number of beds available for that service dedicated to Covid patients.
Full COVID 1/0|INT|1 if service is dedicated to Covid, else N/A.

- [`Sirius`](#sirius): Sirius extract enabling mapping between Orbis room code and the Covid service put together by the hospital. 

Column|Type|Description
---|---|---
Hopital|INT|Code of hospital (e.g.: 96). 
Localisation CDG|STRING|Returns the physical location of the room (e.g: BATIMENT COMMANDANT RIVIERE  NIVEAU 2).
Intitulé Site Crise COVID|STRING|Our "service_covid" field, name of the Covid service as defined by the hospital (e.g.: PSY J. DELAY).
Code Chambre|STRING|The room code. This code, combined with Libelle Chambre gives a mapping to Orbis.
Libelle Chambre|STRING|The label of the room. This label, combined with Code Chambre gives a mapping to Orbis.
Retenir ligne O/N|STRING|"OUI" if the room should be included in the tablem, "NON" otherwise.

Unused so far: `type chambre, commentaires, Code Site, Libelle Site, Date de création, Date de modification, Date d'effet creation, Date de fin de validité, Date d'effet modification, Code Batiment, Libelle Batiment, Date de création, Date de modification, Date d'effet creation, Date de fin de validité, Date d'effet modification, Code Secteur Batiment, Libelle Secteur Batiment, Date de création, Date de modification, Date d'effet creation, Date de fin de validité, Date d'effet modification, Code Etage, Libelle Etage, Date de création, Date de modification, Date d'effet creation, Date de fin de validité, Date d'effet modification, Date de création, Date de modification, Date d'effet creation, Date de fin de validité, Date d'effet modification`

- [`Sivic`](#sivic): Cross-check highlighting discrepancies between Sivic database and Glims/Pacs.

Column|Type|Description
---|---|---
Cas de figure|STRING|Type of discrepancy between Sivic and Glims/Pacs. Expected useful values are "Absent CDGPrésent QLT" and "Présent CDGAbsent QLT".
IPP|INT|Patient id.
Commentaires normalisés|STRING|Validation of the discrepancy by Qualite team. Expected values are "RAS", "AJOUT" or "RETRAIT".
commentaires libre|STRING|Free text field for any additional comment by Qualite team.

<div id="logic">

## Logic

There are a number of subtelties in how each file is connected to the other and the data manipulation. In this section we list each of the steps we need to encode to make sure we get an accurate picture of bed capacity in AP-HP. 

*Orbis*

- **Patients with no room**: this can happen when a patient had a folder created in Orbis but was not yet assigned to a room when the export was run. This should be explicited in our warning section. 
- **Newborns**: two hospital (BCT - Bicêtre, ABC - Antoine Beclere) have `Obstetric` services. When a baby is born, he stays with his mum in the same room, meaning he does not occupy a room. We should account for those and remove patients, from those care units, that were born in 2020.

*Sirius*

- **Code room and label**: Code room are not unique per hospital. That means that we need to match rooms between Sirius and Orbis on a concatenate of the `Code Chambre` and `Label Chambre`. Unfortunately, see a data [exploration here](https://github.com/martindaniel4/ap_hp_covid_19/pull/16), not all label and code chambre match between the two systems (case, trailing 0, special characters). In the meantime we should remove spaces and use one case during data cleaning.

<div id="output">

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

<div id="app">

## React Application

The app is a single webpage. Data processing and display is done using react. To get started: 

```
yarn
yarn start
```

The app is hosted on Heroku. You first need to add heroku branch to master: 

```
git remote add heroku https://git.heroku.com/ap-hp-paris-saclay.git
```

To update the app: 

```
git push heroku master
```

<div id="data-exploration">

## Generate fixture files
 
In order to test the app in development without uploading each time XLS files, you can pass parameter the following parameter: 

```
http://localhost:3000/?fixture=on
```

That parameter will call json fixture files defined in `/src/fixture`. The logic to generate those files is defined in `export_fixture.py`. Steps are:

- Filter data only for 2 hospitals 
- Remove unecessary columns to limit file sizes
- Encrypt personal data like IPP 

To generate those files use the following steps: 

- Make sure you have the python libraries installed with: 

```
pip install -r requirements-data.txt
```

- Then run from a terminal

```
python export_fixture.py
```

- The command above will generate 3 json files. Since Python escapes `/` you need to replace `\/` by `/`. You can achieve this by running from a terminal: 

```
cat orbis_fixture.json | sed 's/\\\//\//g' >> orbis_fixture.json
cat sirius_fixture.json | sed 's/\\\//\//g' >> sirius_fixture.json
```

- You now have 3 json files. You can copy paste the content of those in the `src/fixtures` folder. 

## Data Exploration 

To quickly investigate data discrepancies, we have put together a Jupyter notebook at `ap_hp_exploration.ipynb`. The file can also be rendered on [Github](https://github.com/martindaniel4/ap_hp_covid_19/blob/master/ap_hp_exploration.ipynb).

To run Jupyter notebook locally, install python dependencies with: 

```
pip install -r requirements-data.txt
```

Then at the root of the repo run: 

```
jupyter notebook
```

More details on Jupyter at - https://jupyter.org/
