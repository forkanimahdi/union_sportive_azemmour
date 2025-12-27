# Base de Données - Structure Complète

## Schéma de Base de Données

### Table: users
Extension de la table users existante avec le champ `role`.

**Champs:**
- `id` (uuid, primary)
- `name` (string)
- `email` (string, unique)
- `password` (string, hashed)
- `role` (enum: admin, technical_director, coach, physiotherapist, communication, president)
- `email_verified_at` (timestamp, nullable)
- `remember_token` (string, nullable)
- `created_at`, `updated_at` (timestamps)

### Table: seasons
**Champs:**
- `id` (uuid, primary)
- `name` (string) - "Saison 2024-2025"
- `start_date` (date)
- `end_date` (date)
- `is_active` (boolean, default: false)
- `description` (text, nullable)
- `created_at`, `updated_at`, `deleted_at` (timestamps, soft deletes)

**Relations:**
- hasMany: teams, competitions, media

### Table: teams
**Champs:**
- `id` (uuid, primary)
- `season_id` (uuid, foreign: seasons)
- `category` (enum: U13, U15, U17, Senior)
- `name` (string) - "U17 A", "Senior Elite"
- `description` (text, nullable)
- `is_active` (boolean, default: true)
- `created_at`, `updated_at`, `deleted_at` (timestamps, soft deletes)

**Index:**
- `category`
- `season_id`, `is_active`

**Relations:**
- belongsTo: season
- hasMany: players, trainings, matches, convoctions, media
- belongsToMany: staff (via team_staff)

### Table: staff
**Champs:**
- `id` (uuid, primary)
- `user_id` (uuid, foreign: users, nullable)
- `first_name` (string)
- `last_name` (string)
- `email` (string, unique, nullable)
- `phone` (string, nullable)
- `role` (enum: coach, assistant_coach, goalkeeper_coach, physiotherapist, doctor, communication, equipment_manager)
- `specialization` (text, nullable)
- `license_number` (string, nullable)
- `hire_date` (date, nullable)
- `is_active` (boolean, default: true)
- `created_at`, `updated_at`, `deleted_at` (timestamps, soft deletes)

**Relations:**
- belongsTo: user
- belongsToMany: teams (via team_staff)
- hasMany: trainings (as coach), reportedInjuries, validatedInjuries

### Table: players
**Champs:**
- `id` (uuid, primary)
- `team_id` (uuid, foreign: teams, nullable)
- `first_name` (string)
- `last_name` (string)
- `date_of_birth` (date)
- `position` (enum: gardien, defenseur, milieu, attaquant, nullable)
- `preferred_foot` (enum: gauche, droit, ambidextre, nullable)
- `jersey_number` (string, nullable)
- `photo` (string, nullable)
- `email` (string, nullable)
- `phone` (string, nullable)
- `address` (string, nullable)
- `guardian_name` (string, nullable)
- `guardian_phone` (string, nullable)
- `guardian_email` (string, nullable)
- `guardian_relationship` (string, nullable)
- `medical_certificate_path` (string, nullable)
- `medical_certificate_expiry` (date, nullable)
- `parental_authorization_path` (string, nullable)
- `license_path` (string, nullable)
- `license_number` (string, nullable)
- `is_active` (boolean, default: true)
- `created_at`, `updated_at`, `deleted_at` (timestamps, soft deletes)

**Index:**
- `team_id`, `is_active`

**Relations:**
- belongsTo: team
- hasMany: trainingAttendances, injuries, disciplinaryActions, matchLineups, matchEvents, media, documents
- hasOne: imageRight
- belongsToMany: convoctions (via convocation_players)

**Méthodes Helper:**
- `isMinor()` - Vérifie si < 18 ans
- `isInjured()` - Vérifie si blessée
- `isSuspended()` - Vérifie si suspendue
- `canPlay()` - Vérifie disponibilité complète
- `hasValidMedicalCertificate()` - Vérifie certificat valide

### Table: trainings
**Champs:**
- `id` (uuid, primary)
- `team_id` (uuid, foreign: teams)
- `coach_id` (uuid, foreign: staff, nullable)
- `scheduled_at` (datetime)
- `location` (string)
- `objectives` (text, nullable)
- `rpe` (integer, nullable) - Rate of Perceived Exertion (1-10)
- `coach_notes` (text, nullable)
- `status` (enum: scheduled, completed, cancelled, default: scheduled)
- `created_at`, `updated_at`, `deleted_at` (timestamps, soft deletes)

**Index:**
- `team_id`, `scheduled_at`

**Relations:**
- belongsTo: team, coach
- hasMany: attendances, media, convoctions

### Table: training_attendances
**Champs:**
- `id` (uuid, primary)
- `training_id` (uuid, foreign: trainings)
- `player_id` (uuid, foreign: players)
- `status` (enum: present, absent, late, excused, default: present)
- `arrival_time` (time, nullable)
- `notes` (text, nullable)
- `created_at`, `updated_at` (timestamps)

**Index:**
- Unique: `training_id`, `player_id`
- `player_id`, `status`

**Relations:**
- belongsTo: training, player

### Table: competitions
**Champs:**
- `id` (uuid, primary)
- `season_id` (uuid, foreign: seasons)
- `name` (string)
- `type` (enum: championnat, coupe, amical, tournoi)
- `description` (text, nullable)
- `start_date` (date, nullable)
- `end_date` (date, nullable)
- `is_active` (boolean, default: true)
- `created_at`, `updated_at`, `deleted_at` (timestamps, soft deletes)

**Relations:**
- belongsTo: season
- hasMany: matches

### Table: matches
**Champs:**
- `id` (uuid, primary)
- `competition_id` (uuid, foreign: competitions, nullable)
- `team_id` (uuid, foreign: teams)
- `opponent` (string)
- `scheduled_at` (datetime)
- `venue` (string)
- `type` (enum: domicile, exterieur)
- `home_score` (integer, nullable)
- `away_score` (integer, nullable)
- `status` (enum: scheduled, live, finished, postponed, cancelled, default: scheduled)
- `match_report` (text, nullable)
- `coach_notes` (text, nullable)
- `created_at`, `updated_at`, `deleted_at` (timestamps, soft deletes)

**Index:**
- `team_id`, `scheduled_at`
- `status`

**Relations:**
- belongsTo: competition, team
- hasMany: events, lineups, convoctions, media, equipmentMovements

**Accessor:**
- `score` - Format score selon type (domicile/exterieur)

### Table: match_events
**Champs:**
- `id` (uuid, primary)
- `match_id` (uuid, foreign: matches)
- `player_id` (uuid, foreign: players, nullable)
- `type` (enum: goal, yellow_card, red_card, substitution, injury, penalty, missed_penalty)
- `minute` (integer)
- `description` (text, nullable)
- `substituted_player_id` (uuid, foreign: players, nullable) - Pour substitutions
- `created_at`, `updated_at` (timestamps)

**Index:**
- `match_id`, `minute`

**Relations:**
- belongsTo: match, player, substitutedPlayer

### Table: match_lineups
**Champs:**
- `id` (uuid, primary)
- `match_id` (uuid, foreign: matches)
- `player_id` (uuid, foreign: players)
- `position` (enum: titulaire, remplacante, default: titulaire)
- `jersey_number` (integer, nullable)
- `starting_position` (integer, nullable) - 1-11 pour XI titulaire
- `created_at`, `updated_at` (timestamps)

**Index:**
- Unique: `match_id`, `player_id`
- `match_id`, `position`

**Relations:**
- belongsTo: match, player

### Table: convoctions
**Champs:**
- `id` (uuid, primary)
- `team_id` (uuid, foreign: teams)
- `type` (enum: match, training, stage)
- `match_id` (uuid, foreign: matches, nullable)
- `training_id` (uuid, foreign: trainings, nullable)
- `meeting_time` (datetime)
- `meeting_location` (string)
- `instructions` (text, nullable)
- `status` (enum: draft, sent, confirmed, default: draft)
- `created_by` (uuid, foreign: users)
- `created_at`, `updated_at`, `deleted_at` (timestamps, soft deletes)

**Index:**
- `team_id`, `type`, `status`

**Relations:**
- belongsTo: team, match, training, creator
- belongsToMany: players (via convocation_players)

### Table: convocation_players
**Champs:**
- `id` (uuid, primary)
- `convocation_id` (uuid, foreign: convoctions)
- `player_id` (uuid, foreign: players)
- `status` (enum: selected, reserve, blocked, default: selected)
- `block_reason` (text, nullable) - Raison du blocage
- `response` (enum: pending, confirmed, declined, default: pending)
- `created_at`, `updated_at` (timestamps)

**Index:**
- Unique: `convocation_id`, `player_id`
- `player_id`, `status`

**Relations:**
- belongsTo: convocation, player

### Table: injuries
**Champs:**
- `id` (uuid, primary)
- `player_id` (uuid, foreign: players)
- `reported_by` (uuid, foreign: staff, nullable)
- `type` (string) - "Entorse cheville", "Fracture", etc.
- `description` (text)
- `injury_date` (date)
- `severity` (enum: legere, moderee, grave, default: legere)
- `status` (enum: en_soins, reprise_progressive, apte, default: en_soins)
- `estimated_recovery_date` (date, nullable)
- `actual_recovery_date` (date, nullable)
- `fit_to_play` (boolean, default: false)
- `validated_by` (uuid, foreign: staff, nullable) - Validation kiné
- `validated_at` (timestamp, nullable)
- `medical_notes` (text, nullable)
- `created_at`, `updated_at`, `deleted_at` (timestamps, soft deletes)

**Index:**
- `player_id`, `status`
- `fit_to_play`

**Relations:**
- belongsTo: player, reporter, validator

### Table: disciplinary_actions
**Champs:**
- `id` (uuid, primary)
- `player_id` (uuid, foreign: players)
- `match_id` (uuid, foreign: matches, nullable)
- `card_type` (enum: yellow, red, nullable)
- `suspension_matches` (integer, default: 0)
- `suspension_start_date` (date, nullable)
- `suspension_end_date` (date, nullable)
- `reason` (text, nullable)
- `is_active` (boolean, default: true)
- `created_at`, `updated_at` (timestamps)

**Index:**
- `player_id`, `is_active`
- `suspension_end_date`

**Relations:**
- belongsTo: player, match

### Table: media
**Champs:**
- `id` (uuid, primary)
- `file_path` (string)
- `file_name` (string)
- `mime_type` (string)
- `file_size` (integer) - en bytes
- `type` (enum: photo, video)
- `category` (enum: match, training, portrait, event, other)
- `team_id` (uuid, foreign: teams, nullable)
- `player_id` (uuid, foreign: players, nullable)
- `match_id` (uuid, foreign: matches, nullable)
- `training_id` (uuid, foreign: trainings, nullable)
- `season_id` (uuid, foreign: seasons, nullable)
- `description` (text, nullable)
- `approved_for_social_media` (boolean, default: false)
- `uploaded_by` (uuid, foreign: users)
- `created_at`, `updated_at`, `deleted_at` (timestamps, soft deletes)

**Index:**
- `team_id`, `category`
- `player_id`, `category`
- `approved_for_social_media`

**Relations:**
- belongsTo: team, player, match, training, season, uploader

**Méthode:**
- `canBeShared()` - Vérifie droit à l'image avant partage

### Table: image_rights
**Champs:**
- `id` (uuid, primary)
- `player_id` (uuid, foreign: players)
- `consent_status` (enum: non_signe, signe_usage_interne, signe_diffusion_publique, default: non_signe)
- `document_path` (string) - Document signé
- `signed_date` (date, nullable)
- `expiry_date` (date, nullable)
- `signed_by` (string) - Nom signataire
- `is_minor` (boolean, default: false)
- `guardian_name` (string, nullable)
- `guardian_signature_path` (string, nullable) - Pour mineures
- `notes` (text, nullable)
- `created_at`, `updated_at`, `deleted_at` (timestamps, soft deletes)

**Index:**
- `player_id`, `consent_status`
- `expiry_date`

**Relations:**
- belongsTo: player

**Méthodes:**
- `isValid()` - Vérifie validité autorisation
- `canBeUsedForSocialMedia()` - Vérifie autorisation RS

### Table: equipment
**Champs:**
- `id` (uuid, primary)
- `name` (string)
- `category` (string) - "maillot", "ballon", "equipement"
- `description` (text, nullable)
- `quantity_total` (integer)
- `quantity_available` (integer, default: 0)
- `size` (string, nullable) - Pour maillots
- `brand` (string, nullable)
- `reference` (string, nullable)
- `unit_price` (decimal 10,2, nullable)
- `purchase_date` (date, nullable)
- `condition` (enum: neuf, bon_etat, usage, a_remplacer, default: neuf)
- `responsible_staff_id` (uuid, foreign: staff, nullable)
- `created_at`, `updated_at`, `deleted_at` (timestamps, soft deletes)

**Index:**
- `category`, `quantity_available`

**Relations:**
- belongsTo: responsibleStaff
- hasMany: movements

**Méthode:**
- `updateAvailableQuantity()` - Recalcule quantité disponible

### Table: equipment_movements
**Champs:**
- `id` (uuid, primary)
- `equipment_id` (uuid, foreign: equipment)
- `type` (enum: sortie, retour, perte, dommage, ajout)
- `quantity` (integer)
- `player_id` (uuid, foreign: players, nullable)
- `team_id` (uuid, foreign: teams, nullable)
- `staff_id` (uuid, foreign: staff, nullable)
- `match_id` (uuid, foreign: matches, nullable)
- `notes` (text, nullable)
- `processed_by` (uuid, foreign: users)
- `expected_return_date` (date, nullable)
- `actual_return_date` (date, nullable)
- `created_at`, `updated_at` (timestamps)

**Index:**
- `equipment_id`, `type`
- `player_id`, `type`

**Relations:**
- belongsTo: equipment, player, team, staff, match, processor

### Table: player_documents
**Champs:**
- `id` (uuid, primary)
- `player_id` (uuid, foreign: players)
- `type` (enum: certificat_medical, autorisation_parentale, licence, carte_identite, autre)
- `file_path` (string)
- `file_name` (string)
- `issue_date` (date, nullable)
- `expiry_date` (date, nullable)
- `notes` (text, nullable)
- `created_at`, `updated_at`, `deleted_at` (timestamps, soft deletes)

**Index:**
- `player_id`, `type`
- `expiry_date`

**Relations:**
- belongsTo: player

**Méthodes:**
- `isExpired()` - Vérifie expiration
- `isExpiringSoon()` - Vérifie expiration proche

### Table: team_staff (Pivot)
**Champs:**
- `id` (uuid, primary)
- `team_id` (uuid, foreign: teams)
- `staff_id` (uuid, foreign: staff)
- `role` (enum: head_coach, assistant_coach, goalkeeper_coach, physiotherapist, doctor, equipment_manager)
- `is_primary` (boolean, default: false) - Coach principal
- `assigned_from` (date, nullable)
- `assigned_until` (date, nullable)
- `created_at`, `updated_at` (timestamps)

**Index:**
- Unique: `team_id`, `staff_id`, `role`
- `team_id`, `is_primary`

## Relations Clés

### Relations Many-to-Many
- `teams` ↔ `staff` (via `team_staff`)
- `convoctions` ↔ `players` (via `convocation_players`)

### Relations One-to-Many Principales
- `season` → `teams`, `competitions`, `media`
- `team` → `players`, `trainings`, `matches`, `convoctions`
- `player` → `trainingAttendances`, `injuries`, `disciplinaryActions`, `matchLineups`, `matchEvents`, `media`, `documents`
- `training` → `attendances`, `media`
- `match` → `events`, `lineups`, `media`
- `equipment` → `movements`

### Relations One-to-One
- `player` → `imageRight`

## Contraintes et Validations

### Contraintes d'Intégrité
- Foreign keys avec `onDelete('cascade')` ou `onDelete('set null')` selon logique métier
- Unique constraints pour éviter doublons
- Index sur colonnes fréquemment requêtées

### Validations Métier
- Certificat médical obligatoire et valide pour jouer
- Autorisation parentale obligatoire pour mineures
- Droit à l'image valide pour partage RS
- Blocage automatique joueuses indisponibles

