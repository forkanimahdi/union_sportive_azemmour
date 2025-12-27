# Authentification et Autorisation - Documentation

## Vue d'ensemble

Le système d'authentification et d'autorisation est basé sur les rôles utilisateurs avec middleware Laravel et contrôle d'accès côté frontend.

## Rôles Utilisateurs

### 1. Admin
- **Accès**: Total
- **Permissions**: Toutes les fonctionnalités
- **Description**: Administrateur du club avec accès complet

### 2. Technical Director (Directeur Technique)
- **Accès**: Gestion club, équipes, joueuses, entraînements, matchs, convocations, discipline, médias, droit à l'image
- **Permissions**: Peut gérer toutes les opérations sportives et administratives
- **Description**: Responsable technique du club

### 3. Coach
- **Accès**: Équipes, joueuses, entraînements, matchs, convocations, discipline
- **Permissions**: Gestion des équipes, planification, sélection
- **Description**: Coach d'équipe

### 4. Physiotherapist (Kinésithérapeute)
- **Accès**: Blessures, tableau de bord
- **Permissions**: Déclaration et suivi des blessures, validation "Fit to play"
- **Description**: Soigneur/Kinésithérapeute

### 5. Communication
- **Accès**: Médias, droit à l'image, tableau de bord
- **Permissions**: Gestion des médias, vérification droit à l'image, export pour réseaux sociaux
- **Description**: Responsable communication

### 6. President (Président/Bureau)
- **Accès**: Lecture seule sur toutes les fonctionnalités
- **Permissions**: Consultation uniquement
- **Description**: Membres du bureau, accès en lecture seule

## Middleware

### CheckRole Middleware

Le middleware `CheckRole` vérifie que l'utilisateur authentifié a un des rôles requis.

**Utilisation:**
```php
Route::middleware('role:admin,technical_director')->group(function () {
    // Routes accessibles aux admins et directeurs techniques
});
```

**Fonctionnement:**
1. Vérifie que l'utilisateur est authentifié
2. Si admin → accès automatique
3. Sinon, vérifie que le rôle de l'utilisateur est dans la liste des rôles autorisés
4. Si non autorisé → 403 Forbidden

## Contrôle d'Accès Frontend

### AdminLayout

Le layout admin filtre automatiquement les éléments de menu selon le rôle de l'utilisateur.

**Configuration:**
```jsx
const menuItems = [
    { 
        icon: Users, 
        label: 'Joueuses', 
        href: '/admin/players', 
        roles: ['admin', 'technical_director', 'coach'] 
    },
    // ...
];
```

**Filtrage:**
```jsx
const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(auth.user.role)
);
```

## Helpers Utilisateur

### Méthodes dans le Modèle User

```php
// Vérification de rôle
$user->isAdmin();
$user->isTechnicalDirector();
$user->isCoach();
$user->isPhysiotherapist();
$user->isCommunication();
$user->isPresident();

// Vérification de permissions
$user->canManageClub();      // admin, technical_director
$user->canManagePlayers();   // admin, technical_director, coach
$user->canManageMedia();     // admin, communication, technical_director
```

## Routes Protégées

### Structure des Routes Admin

```php
Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    // Dashboard accessible à tous les rôles authentifiés
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Routes admin/directeur technique
    Route::middleware('role:admin,technical_director')->group(function () {
        // Seasons, Teams, Staff
    });
    
    // Routes coach
    Route::middleware('role:admin,technical_director,coach')->group(function () {
        // Players, Trainings, Matches, Convocations
    });
    
    // Routes kiné
    Route::middleware('role:admin,technical_director,physiotherapist')->group(function () {
        // Injuries
    });
    
    // Routes communication
    Route::middleware('role:admin,technical_director,communication')->group(function () {
        // Media, Image Rights
    });
});
```

## Sécurité

### Bonnes Pratiques

1. **Double Vérification**: Vérification côté serveur (middleware) ET côté client (UI)
2. **Principe du Moindre Privilège**: Accès minimal nécessaire
3. **Audit Log**: Logs des actions sensibles (à implémenter)
4. **Session Timeout**: Déconnexion automatique après inactivité

### Points d'Attention

- Les vérifications frontend sont uniquement pour l'UX, la sécurité réelle est côté serveur
- Toujours utiliser le middleware `role` pour protéger les routes
- Vérifier les permissions dans les contrôleurs avant les actions sensibles
- Ne jamais exposer de données sensibles dans les réponses JSON

## Exemples d'Utilisation

### Dans un Contrôleur

```php
public function store(Request $request)
{
    $user = $request->user();
    
    // Vérification supplémentaire si nécessaire
    if (!$user->canManagePlayers()) {
        abort(403, 'Accès non autorisé');
    }
    
    // Logique métier...
}
```

### Dans un Composant React

```jsx
const { auth } = usePage().props;

if (!auth.user.canManagePlayers) {
    return <div>Accès non autorisé</div>;
}

// Rendu du composant...
```

## Évolution Future

### Améliorations Prévues

- [ ] Système de permissions granulaires (au-delà des rôles)
- [ ] Gestion des permissions par équipe
- [ ] Audit log complet
- [ ] Notifications de changement de permissions
- [ ] Interface de gestion des rôles (admin uniquement)

