# Cahier des charges – Module Entraînements (Séances & Concentrations)

## 1. Contexte & objectifs

La plateforme doit prendre en charge **deux formats distincts** au sein du module Entraînements :

- **Séance classique** : entraînement ponctuel d'une durée inférieure à une journée.
- **Concentration / Camp** : regroupement multi-jours avec hébergement, programme quotidien, présences et suivi médical sur toute la durée.

*Exemple : concentration de 3 jours à Bouznika du 10 au 12 mars 2026 – Senior. Chaque journée contient plusieurs séances, repas, logement et un suivi individuel des joueuses.*

---

## 2. Format A – Séance classique

### 2.1 Champs de création

| Champ | Description |
|-------|-------------|
| Date & Heure | Date et heure de début |
| Équipe | Senior / U17 / U15 |
| Lieu | Terrain ou salle (liste existante) |
| Type de séance | Physique / Tactique / Technique / Gardien / Récupération |
| Durée | En minutes |
| Coach responsable | Sélection dans la liste du staff |
| Notes | Champ texte libre optionnel |

### 2.2 Événements de séance

- **Présence / Absence / Retard** par joueuse
- **Blessure** : joueuse + description + zone du corps (réutiliser le module matchs)
- **Notes médicales** libres

---

## 3. Format B – Concentration / Camp multi-jours

Ce format regroupe plusieurs journées sous un même événement. Il dispose de sa propre fiche, d'un programme par jour et d'un suivi global des joueuses convoquées.

### 3.1 Fiche de la concentration

| Champ | Description |
|-------|-------------|
| Nom / Intitulé | Ex. : Concentration Bouznika – Mars 2026 |
| Date de début | Premier jour du camp |
| Date de fin | Dernier jour du camp |
| Durée calculée | Nombre de jours (automatique) |
| Équipe(s) | Senior / U17 / U15 (multi-sélection possible) |
| Lieu / Ville | Lieu d'hébergement |
| Hébergement | Nom de l'hôtel ou structure d'accueil |
| Objectif | Préparation match / Cohésion / Physique / Autre |
| Responsable | Staff encadrant principal |
| Notes générales | Texte libre |

### 3.2 Liste de convocation

- Sélection des joueuses convoquées parmi l'effectif actif
- **Statut par joueuse** : Convoquée / Présente / Absente / Forfait (blessure)
- Possibilité d'ajouter une **note par joueuse** (ex. : arrivée décalée)
- **Export de la liste de convocation en PDF**

### 3.3 Programme journalier

Pour chaque journée de la concentration, un programme est créé automatiquement. Il contient :

| Élément | Détail |
|--------|--------|
| Séances du jour | 1 à N séances (mêmes champs que Format A) |
| Horaires | Matin / Après-midi / Soir pour chaque séance |
| Repas & récupération | Champs optionnels : petit-déjeuner, déjeuner, dîner, sieste |
| Événements médicaux | Blessure, soin, indisponibilité par joueuse |
| Notes du jour | Observations du coach |

### 3.4 Suivi médical & blessures

- Même module « Ajouter un événement > Blessure » que pour les matchs
- Associé à la joueuse + au jour précis de la concentration
- Possibilité de marquer une joueuse comme « indisponible » pour le reste du camp
- Visible dans le **profil individuel de la joueuse** (historique des blessures)

### 3.5 Tableau de bord

- La concentration apparaît comme un **événement unique** dans le calendrier (durée affichée)
- Le compteur **« Entraînements à venir »** inclut les concentrations planifiées
- **Badge distinctif** pour différencier séance classique et concentration

---

## 4. Comparatif des deux formats

| Fonctionnalité | Séance classique | Concentration |
|----------------|------------------|----------------|
| Durée | < 1 journée | Plusieurs jours |
| Séances multiples par jour | Non | Oui |
| Hébergement | Non | Oui |
| Programme journalier | Non | Oui |
| Convocation joueuses | Présence simple | Liste convocation formelle |
| Suivi blessures | Oui | Oui (par jour) |
| Export PDF | Non | Oui (convocation + programme) |
| Affichage calendrier | Événement 1 jour | Événement multi-jours |

---

*Document de référence : cahier_charges_entrainements_v2*
