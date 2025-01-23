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
        VARCHAR(42) id PK
        VARCHAR(255) username UNIQUE
        VARCHAR(255) email UNIQUE
        TEXT avatar
        TEXT profile_data
        DATETIME created_at
        DATETIME updated_at
    }

    user_favorite_teams {
        INTEGER id PK
        VARCHAR(42) user_id FK
        INTEGER team_id FK
        DATETIME created_at
    }

    user_favorite_sports {
        INTEGER id PK
        VARCHAR(42) user_id FK
        INTEGER sport_id FK
        DATETIME created_at
    }

    user_social_accounts {
        INTEGER id PK
        VARCHAR(42) user_id FK
        VARCHAR(50) platform
        VARCHAR(255) platform_user_id UNIQUE
        VARCHAR(255) username
        INTEGER verified
        DATETIME created_at
    }

    campaigns {
        INTEGER id PK
        VARCHAR(255) name
        TEXT description
        DATETIME start_date
        DATETIME end_date
        VARCHAR(20) status
        TEXT rules
        DATETIME created_at
    }

    sports {
        INTEGER id PK
        VARCHAR(255) name UNIQUE
        TEXT description
        VARCHAR(255) api_identifier
        TEXT api_metadata
        DATETIME created_at
    }

    teams {
        INTEGER id PK
        INTEGER sport_id FK
        VARCHAR(255) name UNIQUE
        VARCHAR(10) abbreviation
        VARCHAR(255) external_id
        TEXT api_metadata
        DATETIME created_at
    }

    team_social_accounts {
        INTEGER id PK
        INTEGER team_id FK
        VARCHAR(50) platform
        VARCHAR(255) platform_user_id UNIQUE
        VARCHAR(255) username
        INTEGER verified
        DATETIME created_at
    }

    games {
        INTEGER id PK
        INTEGER campaign_id FK
        INTEGER sport_id FK
        INTEGER home_team_id FK
        INTEGER away_team_id FK
        DATETIME start_time
        DATETIME end_time
        INTEGER winner_team_id FK
        VARCHAR(50) game_type
        INTEGER points_value
        VARCHAR(20) status
        VARCHAR(255) external_id
        TEXT api_metadata
        DATETIME created_at
    }

    user_predictions {
        INTEGER id PK
        VARCHAR(42) user_id FK
        INTEGER game_id FK
        INTEGER predicted_winner_id FK
        INTEGER points_earned
        DATETIME created_at
    }

    quests {
        INTEGER id PK
        INTEGER campaign_id FK
        VARCHAR(255) name
        TEXT description
        INTEGER points_value
        VARCHAR(50) verification_type
        TEXT verification_data
        DATETIME start_date
        DATETIME end_date
        DATETIME created_at
    }

    user_quest_completions {
        INTEGER id PK
        VARCHAR(42) user_id FK
        INTEGER quest_id FK
        INTEGER points_earned
        DATETIME completed_at
        TEXT verification_proof
    }

    user_points {
        INTEGER id PK
        VARCHAR(42) user_id FK
        INTEGER campaign_id FK
        INTEGER total_points
        INTEGER prediction_points
        INTEGER quest_points
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
