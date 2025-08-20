# Tournament Management System – Schema Documentation

This document outlines the **Mongoose schemas** used in the system.  
The models are designed to handle tournaments, games, teams, clubs, and user management.

---

## 📌 User

Represents a player, admin, or manager.

| Field          | Type                                                  | Notes                      |
| -------------- | ----------------------------------------------------- | -------------------------- |
| registrationId | String                                                | Optional external ID       |
| firstname      | String                                                | Required                   |
| lastname       | String                                                | Required                   |
| avatar         | String                                                | Image URL                  |
| email          | String                                                | Unique, required           |
| username       | String                                                | Unique, required           |
| password       | String                                                | Hashed, required           |
| phone          | String                                                | Optional, unique if set    |
| gender         | Enum(`male`, `female`, `other`)                       |
| city           | String                                                | Required                   |
| stateCode      | String                                                | Required                   |
| dob            | Date                                                  | Required, cannot be future |
| refreshToken   | String                                                | For auth refresh           |
| status         | Enum(`online`, `offline`, `idle`) – default `offline` |
| role           | Enum(`player`, `admin`, `manager`) – default `player` |

🔐 Password is hashed before save.  
🔑 `isPasswordCorrect(password)` → compare password with hash.

---

## 📌 Tournament

Represents a tournament event.

| Field       | Type                                     | Notes          |
| ----------- | ---------------------------------------- | -------------- |
| name        | String                                   | Required       |
| description | String                                   | Optional       |
| bannerUrl   | String                                   | Banner image   |
| location    | String                                   | Required       |
| startDate   | Date                                     | Required       |
| endDate     | Date                                     | Required       |
| isPublic    | Boolean                                  | Default `true` |
| status      | Enum(`upcoming`, `ongoing`, `completed`) |
| staff       | Array of `{ user, role }`                |

### Staff Roles

- `owner`, `organizer`, `manager`, `support`

---

## 📌 TournamentGame

Defines a specific game inside a tournament.

| Field      | Type                                                            | Notes          |
| ---------- | --------------------------------------------------------------- | -------------- |
| tournament | Ref → `Tournament`                                              |
| game       | Ref → `Game`                                                    |
| entryFee   | Number                                                          | Default `0`    |
| format     | Enum(`single_elimination`, `double_elimination`, `round_robin`) |
| teamBased  | Boolean                                                         | Default `true` |
| minPlayers | Number                                                          | Required       |
| maxPlayers | Number                                                          | Required       |

🔒 Unique index on `(tournament, game)`.

---

## 📌 Game

Master list of supported games.

| Field       | Type                                     | Notes              |
| ----------- | ---------------------------------------- | ------------------ |
| name        | String                                   | Unique, required   |
| genre       | String                                   | Optional           |
| platform    | Enum(`pc`, `console`, `mobile`, `table`) |
| description | String                                   |
| rulesUrl    | String                                   | External rules doc |
| icon        | String                                   | Image URL          |
| coverImage  | String                                   | Optional           |

---

## 📌 GameRegistration

Represents registration of a **user or team** into a `TournamentGame`.

| Field          | Type                                                        | Notes          |
| -------------- | ----------------------------------------------------------- | -------------- |
| tournament     | Ref → `Tournament`                                          |
| tournamentGame | Ref → `TournamentGame`                                      |
| user           | Ref → `User` (solo)                                         |
| team           | Ref → `Team` (team-based)                                   |
| status         | Enum(`pending`, `approved`, `rejected`) – default `pending` |
| paid           | Boolean – default `false`                                   |
| paymentMethod  | Enum(`cash`, `stripe`, `manual`) – default `manual`         |
| paymentDetails | String                                                      | Freeform notes |

### Rules

- Either `user` OR `team` is required.
- Unique index per `(tournament, tournamentGame, user)` and `(tournament, tournamentGame, team)`.

---

## 📌 Team

Represents a team within a tournament game.

| Field          | Type                                      | Notes    |
| -------------- | ----------------------------------------- | -------- |
| name           | String                                    | Required |
| logoUrl        | String                                    | Optional |
| captain        | Ref → `User`                              |
| tournament     | Ref → `Tournament`                        |
| tournamentGame | Ref → `TournamentGame`                    |
| club           | Ref → `Club`                              |
| status         | Enum(`active`, `pending`, `disqualified`) |
| locked         | Boolean – default `false`                 |
| autoGenerated  | Boolean – default `false`                 |

---

## 📌 TeamMember

Association of a `User` with a `Team` inside a tournament game.

| Field          | Type                   | Notes |
| -------------- | ---------------------- | ----- |
| tournament     | Ref → `Tournament`     |
| tournamentGame | Ref → `TournamentGame` |
| team           | Ref → `Team`           |
| user           | Ref → `User`           |

🔒 Unique index `(tournament, tournamentGame, user)`.

---

## 📌 JoinRequest

Handles team invites and join requests.

| Field          | Type                                    | Notes |
| -------------- | --------------------------------------- | ----- |
| tournament     | Ref → `Tournament`                      |
| tournamentGame | Ref → `TournamentGame`                  |
| user           | Ref → `User`                            |
| requestType    | Enum(`invite`, `join`)                  |
| status         | Enum(`pending`, `accepted`, `rejected`) |
| team           | Ref → `Team`                            |

---

## 📌 Match

Represents a single match in a bracket.

| Field          | Type                                 | Notes                |
| -------------- | ------------------------------------ | -------------------- |
| tournament     | Ref → `Tournament`                   |
| tournamentGame | Ref → `TournamentGame`               |
| matchNumber    | Number                               | Required             |
| bracketGroup   | Ref → `BracketGroup`                 |
| round          | Number                               | Required             |
| qr             | String                               | QR code for check-in |
| teamA          | Ref → `Team`                         |
| teamB          | Ref → `Team`                         |
| winner         | Ref → `Team`                         |
| loser          | Ref → `Team`                         |
| score          | `{ teamA: Number, teamB: Number }`   |
| bestOf         | Number – default `1`                 |
| scheduledAt    | Date                                 |
| completedAt    | Date                                 |
| nextMatch      | Ref → `Match`                        |
| admin          | Ref → `User`                         |
| events         | Array of `{ type, timestamp, data }` |

### Event Types

- `score`, `foul`, `pause`, `resume`

🔒 Unique index `(tournament, tournamentGame, matchNumber)`.

---

## 📌 BracketGroup

Groups matches into a bracket section (e.g., Winners / Losers).

| Field       | Type                                       | Notes    |
| ----------- | ------------------------------------------ | -------- |
| tournament  | Ref → `Tournament`                         |
| game        | Ref → `Game`                               |
| name        | String                                     | Required |
| order       | Number                                     | Ordering |
| bracketSide | Enum(`winner`, `loser`) – default `winner` |

🔒 Unique index `(tournament, game, name)`.

---

## 📌 Club

Represents a physical or virtual club.

| Field       | Type   | Notes            |
| ----------- | ------ | ---------------- |
| name        | String | Unique, required |
| description | String |
| logo        | String | Image URL        |
| city        | String | Required         |
| state       | String | Required         |

---

## 📌 ClubMember

Associates a `User` with a `Club`.

| Field  | Type                                                            | Notes |
| ------ | --------------------------------------------------------------- | ----- |
| club   | Ref → `Club`                                                    |
| user   | Ref → `User`                                                    |
| role   | Enum(`player`, `captain`, `manager`, `coach`, `admin`, `bench`) |
| status | Enum(`active`, `pending`, `removed`) – default `pending`        |

---

# 🔮 Notes & Conventions

- **Soft constraints**: Business logic (like max players in team) enforced at service level.
- **Indexes**: Many models have compound unique indexes to prevent duplicate records.
- **Extensible**: Future support for payments, streams, and live scoring can attach to `Match.events` or a separate `ScoreEvent` model.
