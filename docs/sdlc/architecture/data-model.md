# Data Model

<!-- sdlc:auto:start entities -->
### users

| Field | Type | PK | FK | Nullable |
|---|---|---|---|---|
| id | uuid | True | — | False |
| username | varchar(64) | False | — | False |
| password_hash | varchar(255) | False | — | False |
| role | varchar(16) | False | — | False |
| is_active | boolean | False | — | False |
| created_at | timestamptz | False | — | False |

### patients

| Field | Type | PK | FK | Nullable |
|---|---|---|---|---|
| id | uuid | True | — | False |
| first_name | varchar(100) | False | — | False |
| last_name | varchar(100) | False | — | False |
| phone | varchar(32) | False | — | True |
| email | varchar(255) | False | — | True |
| created_at | timestamptz | False | — | False |
| updated_at | timestamptz | False | — | False |

### providers

| Field | Type | PK | FK | Nullable |
|---|---|---|---|---|
| id | uuid | True | — | False |
| name | varchar(120) | False | — | False |
| specialty | varchar(120) | False | — | True |
| is_active | boolean | False | — | False |

### appointments

| Field | Type | PK | FK | Nullable |
|---|---|---|---|---|
| id | uuid | True | — | False |
| patient_id | uuid | False | patients.id | False |
| provider_id | uuid | False | providers.id | False |
| start_time | timestamptz | False | — | False |
| end_time | timestamptz | False | — | False |
| status | varchar(16) | False | — | False |
| reason_note | text | False | — | True |
| created_by | uuid | False | users.id | True |
| created_at | timestamptz | False | — | False |
| updated_at | timestamptz | False | — | False |
<!-- sdlc:auto:end entities -->

<!-- sdlc:auto:start relationships -->
| Source | Target | Type |
|---|---|---|
| patients | appointments | one-to-many |
| providers | appointments | one-to-many |
| users | appointments | one-to-many |
<!-- sdlc:auto:end relationships -->

<!-- sdlc:auto:start er-diagram -->
```mermaid
erDiagram
  users {
    uuid id PK
    varchar_64_ username
    varchar_255_ password_hash
    varchar_16_ role
    boolean is_active
    timestamptz created_at
  }
  patients {
    uuid id PK
    varchar_100_ first_name
    varchar_100_ last_name
    varchar_32_ phone
    varchar_255_ email
    timestamptz created_at
    timestamptz updated_at
  }
  providers {
    uuid id PK
    varchar_120_ name
    varchar_120_ specialty
    boolean is_active
  }
  appointments {
    uuid id PK
    uuid patient_id FK
    uuid provider_id FK
    timestamptz start_time
    timestamptz end_time
    varchar_16_ status
    text reason_note
    uuid created_by FK
    timestamptz created_at
    timestamptz updated_at
  }
  patients ||--o{ appointments : "one-to-many"
  providers ||--o{ appointments : "one-to-many"
  users ||--o{ appointments : "one-to-many"
```
<!-- sdlc:auto:end er-diagram -->
