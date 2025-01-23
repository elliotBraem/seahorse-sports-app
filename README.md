<!-- markdownlint-disable MD014 -->
<!-- markdownlint-disable MD033 -->
<!-- markdownlint-disable MD041 -->
<!-- markdownlint-disable MD029 -->

<div align="center">

<h1 style="font-size: 2.5rem; font-weight: bold;">RNG FanClub</h1>

  <p>
    <strong>connects athletes, fans, and brands to revolutionize sports</strong>
  </p>

</div>

<details>
  <summary>Table of Contents</summary>

- [Getting Started](#getting-started)
  - [Initializing the repository](#initializing-the-repository)
  - [Running the app](#running-the-app)
  - [Building for production](#building-for-production)
- [Contributing](#contributing)

</details>

```mermaid
erDiagram
    users {
        VARCHAR id PK
        VARCHAR username UNIQUE
        VARCHAR email UNIQUE
        TEXT avatar
        TEXT profile_data
        DATETIME created_at
        DATETIME updated_at
    }

    user_favorite_teams {
        INT id PK
        VARCHAR user_id FK
        INT team_id FK
        DATETIME created_at
    }

    user_favorite_sports {
        INT id PK
        VARCHAR user_id FK
        INT sport_id FK
        DATETIME created_at
    }

    user_social_accounts {
        INT id PK
        VARCHAR user_id FK
        VARCHAR platform
        VARCHAR platform_user_id UNIQUE
        VARCHAR username
        INT verified
        DATETIME created_at
    }

    campaigns {
        INT id PK
        VARCHAR name
        TEXT description
        DATETIME start_date
        DATETIME end_date
        VARCHAR status
        TEXT rules
        DATETIME created_at
    }

    sports {
        INT id PK
        VARCHAR name UNIQUE
        TEXT description
        VARCHAR api_identifier
        TEXT api_metadata
        DATETIME created_at
    }

    teams {
        INT id PK
        INT sport_id FK
        VARCHAR name UNIQUE
        VARCHAR abbreviation
        VARCHAR external_id
        TEXT api_metadata
        DATETIME created_at
    }

    team_social_accounts {
        INT id PK
        INT team_id FK
        VARCHAR platform
        VARCHAR platform_user_id UNIQUE
        VARCHAR username
        INT verified
        DATETIME created_at
    }

    games {
        INT id PK
        INT campaign_id FK
        INT sport_id FK
        INT home_team_id FK
        INT away_team_id FK
        DATETIME start_time
        DATETIME end_time
        INT winner_team_id FK
        VARCHAR game_type
        INT points_value
        VARCHAR status
        VARCHAR external_id
        TEXT api_metadata
        DATETIME created_at
    }

    user_predictions {
        INT id PK
        VARCHAR user_id FK
        INT game_id FK
        INT predicted_winner_id FK
        INT points_earned
        DATETIME created_at
    }

    quests {
        INT id PK
        INT campaign_id FK
        VARCHAR name
        TEXT description
        INT points_value
        VARCHAR verification_type
        TEXT verification_data
        DATETIME start_date
        DATETIME end_date
        DATETIME created_at
    }

    user_quest_completions {
        INT id PK
        VARCHAR user_id FK
        INT quest_id FK
        INT points_earned
        DATETIME completed_at
        TEXT verification_proof
    }

    user_points {
        INT id PK
        VARCHAR user_id FK
        INT campaign_id FK
        INT total_points
        INT prediction_points
        INT quest_points
        DATETIME last_updated
    }

    users ||--o{ user_favorite_teams : "has"
    users ||--o{ user_favorite_sports : "has"
    users ||--o{ user_social_accounts : "has"
    users ||--o{ user_predictions : "makes"
    users ||--o{ user_quest_completions : "completes"
    users ||--o{ user_points : "earns"

    campaigns ||--o{ games : "has"
    campaigns ||--o{ quests : "has"
    campaigns ||--o{ user_points : "tracks"

    sports ||--o{ teams : "includes"
    sports ||--o{ games : "played in"

    teams ||--o{ team_social_accounts : "has"
    teams ||--o{ games : "participates"
    teams ||--o{ user_favorite_teams : "fans"

    quests ||--o{ user_quest_completions : "completed by"

    games ||--o{ user_predictions : "predicted by"
```

## Getting Started

### Initializing the repository

To bootstrap the [API](./apps/api)'s SQLite (Cloudflare) and install dependencies:

```bash
bun run init
```

You can rerun this command to reset the full database.

### Running the app

First, run the development server:

```bash
bun run dev
```

This will run the Next.js app, and simulate a local Cloudflare worker.

### Building for production

```bash
bun run build
```

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you're interested in contributing to this project, please read the [contribution guide](./CONTRIBUTING).

<div align="right">
<a href="https://nearbuilders.org" target="_blank">
<img
  src="https://builders.mypinata.cloud/ipfs/QmWt1Nm47rypXFEamgeuadkvZendaUvAkcgJ3vtYf1rBFj"
  alt="Near Builders"
  height="40"
/>
</a>
</div>
