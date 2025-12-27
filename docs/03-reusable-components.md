# Composants Réutilisables - Documentation

## Vue d'ensemble

Les composants réutilisables sont situés dans `resources/js/components/admin/` et peuvent être utilisés dans tous les modules de l'application.

## Composants Disponibles

### 1. StatusBadge

Badge de statut avec icône et couleur selon le type et le statut.

**Props:**
- `status` (string, required) - Statut à afficher
- `type` (string, optional) - Type de badge: 'player', 'training', 'match', 'injury', 'default'

**Exemple:**
```jsx
<StatusBadge status="active" type="player" />
<StatusBadge status="scheduled" type="match" />
<StatusBadge status="en_soins" type="injury" />
```

**Statuts supportés:**
- **Player**: active, injured, suspended, unavailable
- **Training**: scheduled, completed, cancelled
- **Match**: scheduled, live, finished, postponed, cancelled
- **Injury**: en_soins, reprise_progressive, apte

### 2. PlayerCard

Carte joueuse avec photo, informations principales et statut.

**Props:**
- `player` (object, required) - Objet joueuse
- `onClick` (function, optional) - Handler au clic
- `showTeam` (boolean, default: true) - Afficher le nom de l'équipe

**Exemple:**
```jsx
<PlayerCard 
    player={player} 
    onClick={() => router.visit(`/admin/players/${player.id}`)}
    showTeam={true}
/>
```

**Données attendues dans player:**
- `first_name`, `last_name`
- `photo`, `jersey_number`
- `date_of_birth`, `position`
- `phone`, `email`
- `team` (object avec `name`)
- `can_play` (boolean, optional)

### 3. MatchCard

Carte match avec adversaire, date, lieu, score.

**Props:**
- `match` (object, required) - Objet match
- `onClick` (function, optional) - Handler au clic
- `showTeam` (boolean, default: true) - Afficher le nom de l'équipe

**Exemple:**
```jsx
<MatchCard 
    match={match} 
    onClick={() => router.visit(`/admin/matches/${match.id}`)}
/>
```

**Données attendues dans match:**
- `opponent`, `scheduled_at`, `venue`
- `type` (domicile/exterieur)
- `home_score`, `away_score`
- `status`
- `competition` (object avec `name`, optional)
- `team` (object avec `name`, optional)

### 4. DataTable

Tableau de données avec recherche, tri, pagination.

**Props:**
- `columns` (array, required) - Configuration des colonnes
- `data` (array, required) - Données à afficher
- `onRowClick` (function, optional) - Handler au clic sur une ligne
- `searchable` (boolean, default: true) - Activer la recherche
- `filterable` (boolean, default: false) - Activer les filtres
- `paginated` (boolean, default: true) - Activer la pagination
- `pageSize` (number, default: 10) - Nombre d'éléments par page

**Exemple:**
```jsx
<DataTable
    columns={[
        { key: 'name', label: 'Nom', sortable: true },
        { key: 'email', label: 'Email', sortable: true },
        { 
            key: 'status', 
            label: 'Statut',
            render: (value) => <StatusBadge status={value} />
        }
    ]}
    data={players}
    onRowClick={(row) => router.visit(`/admin/players/${row.id}`)}
    pageSize={15}
/>
```

**Configuration des colonnes:**
- `key` (string, required) - Clé de la propriété dans les données
- `label` (string, required) - Libellé de la colonne
- `sortable` (boolean, optional) - Activer le tri
- `render` (function, optional) - Fonction de rendu personnalisée: `(value, row) => ReactNode`

## Bonnes Pratiques

### Utilisation des Composants

1. **Import cohérent**: Toujours importer depuis `@/components/admin/`
2. **Props typées**: Utiliser TypeScript pour typer les props (si disponible)
3. **Accessibilité**: Tous les composants respectent les standards d'accessibilité
4. **Responsive**: Tous les composants sont responsive

### Extension des Composants

Pour créer de nouveaux composants réutilisables:

1. Créer le fichier dans `resources/js/components/admin/`
2. Suivre la même structure que les composants existants
3. Utiliser Tailwind CSS pour le styling
4. Respecter le design system (couleur alpha, espacements)
5. Documenter dans ce fichier

### Design System

- **Couleur principale**: `alpha` (#571123)
- **Espacements**: Utiliser les classes Tailwind standard (p-4, gap-4, etc.)
- **Bordures**: `border-gray-200` pour les cartes, `border-alpha` pour les accents
- **Hover**: `hover:shadow-lg`, `hover:text-alpha` pour les interactions
- **Responsive**: Utiliser les breakpoints Tailwind (sm:, md:, lg:)

## Composants à Créer

### Prochains Composants
- [ ] DocumentUpload - Upload de documents avec validation
- [ ] ImageRightsChecker - Vérificateur droit à l'image
- [ ] ConvocationGenerator - Générateur de convocations
- [ ] PDFExporter - Export PDF
- [ ] FormField - Champ de formulaire réutilisable
- [ ] Modal - Modal réutilisable
- [ ] ConfirmDialog - Dialogue de confirmation
- [ ] DatePicker - Sélecteur de date
- [ ] Select - Sélecteur avec recherche
- [ ] FileUpload - Upload de fichiers avec preview

