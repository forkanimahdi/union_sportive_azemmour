# CUSA Web App: Engineering Blueprint Alignment

This document maps the **Terms of Reference** (blueprint) to the codebase and notes constraints to respect.

---

## 1. Structural Hierarchy

| Level | Blueprint | Implementation |
|-------|----------|----------------|
| **Season** | Top-level container for all data | `Season` model; `teams`, `competitions`, `media` relations. |
| **Team** | Belongs to Category (U13, U15, U17, Senior) + Season | `Team` model: `season_id`, `category`; `Season` → `Team` relation. |
| **Players/Staff** | Assigned to Teams within a Season | `Player.team_id`, `team_staff` pivot; teams are season-scoped. |
| **Events** | Training and Matches are children of Team | `Training.team_id`, `GameMatch.team_id`. |

**Constraint:** All team-scoped data (players, trainings, matches) is implicitly season-scoped via `Team.season_id`.

---

## 2. Mandatory "Fit to Play" Logic (Gatekeeping)

Before a player can be added to a **Match Convocation**, three soft locks are enforced:

| Gate | Rule | Implementation |
|------|------|----------------|
| **Medical** | Status must be "Apte" (Fit). "En soins" / "Reprise" = blocked | `Player::isInjured()` – blocks if any injury has `status` in `['en_soins','reprise_progressive']` or `fit_to_play = false`. |
| **Disciplinary** | No active suspension (cards history) | `Player::isSuspended()` – active disciplinary actions. |
| **Administrative** | Valid license + parental authorization for minors | `Player::hasValidLicense()`, `Player::hasParentalAuthorizationWhenMinor()`. |

- **Single entry point:** `Player::canPlay()` and `Player::getFitToPlayBlockReason()`.
- **Convocation use:** `App\Services\FitToPlayGate::canBeConvoked(Player $player)` – returns block reason or `null`. When adding a player to a convocation, call this; if non-null, either block the add or attach with `block_reason` set on `convocation_players` pivot.

---

## 3. Media & Image Rights Firewall

- **Rule:** No media export/share if the player’s "Droit à l’image" is not validated.

| Consent (blueprint) | DB value | Usage |
|---------------------|----------|--------|
| `NON_SIGNE` | `non_signe` | Total block on media exports. |
| `USAGE_INTERNE` | `signe_usage_interne` | Internal dashboard only. |
| `DIFFUSION_PUBLIQUE` | `signe_diffusion_publique` | Social / external export allowed. |

- **Constants:** `ImageRight::CONSENT_NON_SIGNE`, `CONSENT_USAGE_INTERNE`, `CONSENT_DIFFUSION_PUBLIQUE`.
- **Checks:** `Media::canBeShared()` – external export (requires DIFFUSION_PUBLIQUE). `Media::canBeUsedInternally()` – internal use (USAGE_INTERNE or DIFFUSION_PUBLIQUE). Export/API layers must call these before serving or generating exports.

---

## 4. Operational Workflows

| Workflow | Blueprint | Implementation |
|----------|----------|----------------|
| **Training** | Attendance (Present/Absent/Late), Coach Comments, RPE | `Training` (objectives, rpe, coach_notes); `TrainingAttendance` with status. |
| **Matches** | Digital match sheet: goals, cards, injuries | `GameMatch`, `MatchEvent` (goal, yellow_card, red_card, etc.), match report. |
| **Medical** | Only medical staff update "Fit to Play" | Injury validation: `validated_by` (staff); routes under `role:admin,technical_director,physiotherapist`. |

---

## 5. User Roles (RBAC)

| Role | Blueprint | Routes / middleware |
|------|----------|---------------------|
| **Admin** | Global access | `CheckRole` – `admin` bypasses role checks. |
| **Technical Director** | Broad management | `role:admin,technical_director` on seasons, teams, staff, injuries, media, image rights, equipment. |
| **Coach** | Team-specific (Training, Matches) | `role:admin,technical_director,coach` on players, trainings, matches, convoctions, discipline. |
| **Medical (Physiotherapist)** | Injury + medical clearance | `role:admin,technical_director,physiotherapist` on injuries + validate. |
| **Communication** | Media, restricted by consent | `role:admin,technical_director,communication` on media, image-rights. |
| **Bureau** | Read-only dashboards | Not yet implemented; add `bureau` role and read-only dashboard routes if required. |

---

## 6. Technical Standards

| Standard | Blueprint | Notes |
|----------|----------|--------|
| **Mobile-first** | UI usable on the field (responsive) | Ensure layouts and touch targets work on small screens. |
| **Exports** | PDF and WhatsApp-ready text for convocations/reports | Use `Media::canBeShared()` / `canBeUsedInternally()` before generating exports that include player-linked media. |

---

## Files to Keep Aligned

- **Fit to Play:** `App\Models\Player` (canPlay, getFitToPlayBlockReason, isInjured, hasValidLicense, hasParentalAuthorizationWhenMinor), `App\Services\FitToPlayGate`, `App\Http\Controllers\Admin\ConvocationController` (when adding players).
- **Image rights:** `App\Models\ImageRight` (constants, canBeUsedInternally, canBeUsedForSocialMedia), `App\Models\Media` (canBeShared, canBeUsedInternally).
- **RBAC:** `App\Http\Middleware\CheckRole`, `routes/admin.php` (role middleware on each group).
