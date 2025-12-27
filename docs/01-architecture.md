# CUSA - Club de Football Féminin - Documentation Technique

## Architecture du Système

### Stack Technologique
- **Backend**: Laravel 11 (PHP)
- **Frontend**: React 19 + Inertia.js
- **Styling**: Tailwind CSS v4
- **Base de données**: SQLite (développement) / MySQL (production)
- **Authentification**: Laravel Sanctum

### Structure des Dossiers

```
resources/js/Pages/
├── admin/              # Pages d'administration
│   ├── index.jsx       # Dashboard admin
│   └── partials/        # Composants réutilisables
├── seasons/            # Gestion des saisons
├── teams/              # Gestion des équipes
├── players/            # Gestion des joueuses
├── trainings/          # Gestion des entraînements
├── matches/            # Gestion des matchs
├── convoctions/        # Gestion des convocations
├── injuries/           # Suivi médical
├── discipline/         # Discipline et cartons
├── media/              # Galerie et médias
├── image-rights/       # Droit à l'image (CRITIQUE)
├── staff/              # Gestion du staff
├── equipment/          # Gestion du matériel
└── dashboard/          # Tableau de bord principal
```

## Modèle de Données

### Entités Principales

#### 1. Seasons (Saisons)
- Gestion des saisons sportives
- Une saison active à la fois
- Relation avec équipes, compétitions, médias

#### 2. Teams (Équipes)
- Catégories: U13, U15, U17, Senior
- Relation avec saison, joueuses, staff, entraînements, matchs

#### 3. Players (Joueuses)
- Informations complètes (identité, poste, documents)
- Gestion des mineures (tuteur légal)
- Documents: certificat médical, autorisation parentale, licence
- Statuts: actif, blessé, suspendu, apte

#### 4. Staff (Personnel)
- Rôles: coach, assistant, kiné, médecin, communication, équipementier
- Relation avec utilisateurs (User)
- Affectation aux équipes

#### 5. Trainings (Entraînements)
- Planification, présence, RPE, notes coach
- Historique par joueuse et équipe

#### 6. Matches (Matchs)
- Compétitions, adversaires, scores, événements
- Feuille de match digitale
- Rapport de match

#### 7. Convocations
- Match, entraînement, stage
- Sélection intelligente avec blocage automatique
- Export PDF/WhatsApp

#### 8. Injuries (Blessures)
- Déclaration, suivi médical, validation "Fit to play"
- Statuts: en soins, reprise progressive, apte

#### 9. Disciplinary Actions (Discipline)
- Cartons automatiques via feuille de match
- Calcul suspensions paramétrable
- Alertes avant matchs

#### 10. Media (Médias)
- Photos/vidéos par match/entraînement/événement
- Validation droit à l'image obligatoire
- Filtres et export

#### 11. Image Rights (Droit à l'Image) - CRITIQUE
- Consentement obligatoire
- Statuts: non signé, usage interne, diffusion publique
- Autorisation parentale pour mineures
- Blocage automatique si non valide

#### 12. Equipment (Matériel)
- Inventaire, sorties/retours
- Suivi des mouvements
- Responsable matériel

## Rôles et Permissions

### Rôles Utilisateurs
1. **admin** - Administrateur club (accès total)
2. **technical_director** - Directeur technique
3. **coach** - Coach
4. **physiotherapist** - Soigneur/Kinésithérapeute
5. **communication** - Responsable communication
6. **president** - Président/Bureau (lecture seule)

### Matrice de Permissions

| Fonctionnalité | Admin | Tech Dir | Coach | Kiné | Com | Président |
|----------------|-------|----------|-------|------|-----|-----------|
| Gestion Club | ✅ | ✅ | ❌ | ❌ | ❌ | 👁️ |
| Gestion Joueuses | ✅ | ✅ | ✅ | ❌ | ❌ | 👁️ |
| Entraînements | ✅ | ✅ | ✅ | ❌ | ❌ | 👁️ |
| Matchs | ✅ | ✅ | ✅ | ❌ | ❌ | 👁️ |
| Convocations | ✅ | ✅ | ✅ | ❌ | ❌ | 👁️ |
| Suivi Médical | ✅ | ✅ | ❌ | ✅ | ❌ | 👁️ |
| Discipline | ✅ | ✅ | ✅ | ❌ | ❌ | 👁️ |
| Médias | ✅ | ✅ | ❌ | ❌ | ✅ | 👁️ |
| Droit Image | ✅ | ✅ | ❌ | ❌ | ✅ | 👁️ |
| Matériel | ✅ | ✅ | ❌ | ❌ | ❌ | 👁️ |

👁️ = Lecture seule

## Règles Métier Critiques

### Droit à l'Image
- **AUCUN** média ne peut être partagé/exporté pour RS si autorisation non valide
- Vérification automatique avant export
- Autorisation parentale obligatoire pour mineures
- Expiration des autorisations gérée automatiquement

### Disponibilité des Joueuses
Une joueuse est automatiquement bloquée si:
- Blessée (status != 'apte' OU fit_to_play = false)
- Suspendue (suspension active)
- Certificat médical expiré
- Autorisation parentale manquante (mineures)

### Convocations Intelligentes
- Détection automatique des joueuses indisponibles
- Raison de blocage affichée
- Impossible de sélectionner une joueuse bloquée

### Discipline
- Cartons enregistrés automatiquement via feuille de match
- Calcul suspensions selon règles paramétrables
- Alertes avant matchs pour suspensions actives

## Composants Réutilisables

### Composants UI
- `DataTable` - Tableau de données avec tri, filtres, pagination
- `PlayerCard` - Carte joueuse avec photo, infos, statut
- `MatchCard` - Carte match avec scores, adversaire
- `StatusBadge` - Badge de statut (actif, blessé, suspendu)
- `DocumentUpload` - Upload de documents avec validation
- `ImageRightsChecker` - Vérificateur droit à l'image
- `ConvocationGenerator` - Générateur de convocations
- `PDFExporter` - Export PDF (convocation, feuille, rapport)

### Composants Formulaires
- `PlayerForm` - Formulaire joueuse complet
- `TrainingForm` - Formulaire entraînement
- `MatchForm` - Formulaire match
- `InjuryForm` - Formulaire blessure
- `DocumentForm` - Formulaire document

## API Endpoints (Laravel Routes)

### Routes Protégées (auth middleware)
- `/admin/*` - Administration
- `/seasons/*` - Saisons
- `/teams/*` - Équipes
- `/players/*` - Joueuses
- `/trainings/*` - Entraînements
- `/matches/*` - Matchs
- `/convoctions/*` - Convocations
- `/injuries/*` - Blessures
- `/discipline/*` - Discipline
- `/media/*` - Médias
- `/image-rights/*` - Droit à l'image
- `/staff/*` - Staff
- `/equipment/*` - Matériel

## Sécurité

### Protection des Données
- Chiffrement des données sensibles
- Validation stricte des uploads
- Vérification droit à l'image avant partage
- Logs d'audit pour actions critiques

### Conformité RGPD
- Gestion consentement droit à l'image
- Protection données mineures
- Droit à l'oubli
- Export données personnelles

## Performance

### Optimisations
- Eager loading des relations
- Cache des statistiques
- Pagination pour grandes listes
- Lazy loading des images
- Indexation base de données

## Tests

### Tests à Implémenter
- Tests unitaires modèles
- Tests fonctionnels contrôleurs
- Tests d'intégration workflows
- Tests validation droit à l'image
- Tests permissions

