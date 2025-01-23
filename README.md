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
    users ||--o{ user_favorite_teams : has
    users ||--o{ user_favorite_sports : has
    users ||--o{ user_social_accounts : has
    users ||--o{ user_predictions : makes
    users ||--o{ user_quest_completions : completes
    users ||--o{ user_points : earns

    campaigns ||--o{ games : contains
    campaigns ||--o{ quests : offers
    campaigns ||--o{ user_points : tracks

    sports ||--o{ teams : has
    sports ||--o{ games : includes
    sports ||--o{ user_favorite_sports : belongs_to

    teams ||--o{ user_favorite_teams : belongs_to
    teams ||--o{ team_social_accounts : has
    teams ||--o{ games : plays_home
    teams ||--o{ games : plays_away
    teams ||--o{ user_predictions : predicted_winner

    games ||--o{ user_predictions : receives
    quests ||--o{ user_quest_completions : completed_by

    users {
        varchar id PK
        varchar username
        varchar email
        text avatar
        text profile_data
        datetime created_at
    }

    campaigns {
        integer id PK
        varchar name
        text description
        datetime start_date
        datetime end_date
        varchar status
        text rules
    }

    sports {
        integer id PK
        varchar name
        text description
        varchar api_identifier
        text api_metadata
    }

    teams {
        integer id PK
        integer sport_id FK
        varchar name
        varchar abbreviation
        varchar external_id
        text api_metadata
    }

    games {
        integer id PK
        integer campaign_id FK
        integer sport_id FK
        integer home_team_id FK
        integer away_team_id FK
        datetime start_time
        integer winner_team_id FK
        varchar game_type
        integer points_value
    }

    user_predictions {
        integer id PK
        varchar user_id FK
        integer game_id FK
        integer predicted_winner_id FK
        integer points_earned
    }

    quests {
        integer id PK
        integer campaign_id FK
        varchar name
        text description
        integer points_value
        varchar verification_type
        datetime start_date
        datetime end_date
    }

    user_points {
        integer id PK
        varchar user_id FK
        integer campaign_id FK
        integer total_points
        integer prediction_points
        integer quest_points
    }
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
