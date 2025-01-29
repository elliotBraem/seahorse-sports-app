-- Users table with extended profile data
CREATE TABLE users (
    id VARCHAR(42) PRIMARY KEY, -- EVM wallet address
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    avatar TEXT,
    profile_data TEXT DEFAULT '{}', -- Stores custom profile data as JSON string
    created_at DATETIME DEFAULT (datetime('now')),
    updated_at DATETIME DEFAULT (datetime('now'))
);

-- User favorite teams
CREATE TABLE user_favorite_teams (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id VARCHAR(42) REFERENCES users(id) ON DELETE CASCADE,
    team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
    created_at DATETIME DEFAULT (datetime('now')),
    UNIQUE(user_id, team_id)
);

-- User favorite sports
CREATE TABLE user_favorite_sports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id VARCHAR(42) REFERENCES users(id) ON DELETE CASCADE,
    sport_id INTEGER REFERENCES sports(id) ON DELETE CASCADE,
    created_at DATETIME DEFAULT (datetime('now')),
    UNIQUE(user_id, sport_id)
);

-- User social accounts
CREATE TABLE user_social_accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id VARCHAR(42) REFERENCES users(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL, -- twitter, discord, etc.
    platform_user_id VARCHAR(255) NOT NULL,
    username VARCHAR(255),
    verified INTEGER DEFAULT 0, -- SQLite uses INTEGER for boolean
    created_at DATETIME DEFAULT (datetime('now')),
    UNIQUE(platform, platform_user_id)
);

-- Campaigns table (for different seasons/tournaments)
CREATE TABLE campaigns (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    status VARCHAR(20) DEFAULT 'upcoming', -- upcoming, active, completed
    rules TEXT DEFAULT '{}', -- Store campaign-specific rules as JSON string
    created_at DATETIME DEFAULT (datetime('now')),
    CHECK (end_date > start_date),
    CHECK (status IN ('upcoming', 'active', 'completed'))
);

-- Sports table
CREATE TABLE sports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    abbreviation VARCHAR(10),
    external_id VARCHAR(255), -- For external API mapping
    api_metadata TEXT DEFAULT '{}', -- Store API-specific data as JSON string
    created_at DATETIME DEFAULT (datetime('now'))
);

-- Teams table with external API integration
CREATE TABLE teams (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sport_id INTEGER REFERENCES sports(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    abbreviation VARCHAR(10),
    external_id VARCHAR(255), -- For external API mapping
    api_metadata TEXT DEFAULT '{}', -- Store API-specific data as JSON string
    created_at DATETIME DEFAULT (datetime('now')),
    UNIQUE(sport_id, name)
);

-- Team social accounts
CREATE TABLE team_social_accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL,
    platform_user_id VARCHAR(255) NOT NULL,
    username VARCHAR(255),
    verified INTEGER DEFAULT 0, -- SQLite uses INTEGER for boolean
    created_at DATETIME DEFAULT (datetime('now')),
    UNIQUE(team_id, platform)
);

-- Games table with enhanced constraints
CREATE TABLE games (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    campaign_id INTEGER REFERENCES campaigns(id) ON DELETE CASCADE,
    sport_id INTEGER REFERENCES sports(id) ON DELETE CASCADE,
    home_team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
    away_team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
    start_time DATETIME NOT NULL,
    end_time DATETIME,
    winner_team_id INTEGER REFERENCES teams(id) ON DELETE SET NULL,
    game_type VARCHAR(50), -- conference_championship, superbowl, regular_season, etc.
    points_value INTEGER NOT NULL DEFAULT 10,
    status VARCHAR(20) DEFAULT 'upcoming',
    external_id VARCHAR(255), -- For external API mapping
    api_metadata TEXT DEFAULT '{}', -- Store API-specific data as JSON string
    created_at DATETIME DEFAULT (datetime('now')),
    CHECK (home_team_id != away_team_id),
    CHECK (winner_team_id IS NULL OR winner_team_id IN (home_team_id, away_team_id)),
    CHECK (points_value > 0),
    CHECK (status IN ('upcoming', 'active', 'completed'))
);

-- User Predictions table with enhanced constraints
CREATE TABLE user_predictions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id VARCHAR(42) REFERENCES users(id) ON DELETE CASCADE,
    game_id INTEGER REFERENCES games(id) ON DELETE CASCADE,
    predicted_winner_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
    points_earned INTEGER,
    created_at DATETIME DEFAULT (datetime('now')),
    CHECK (points_earned >= 0),
    UNIQUE(user_id, game_id)
);

-- Quests table with enhanced validation
CREATE TABLE quests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    campaign_id INTEGER REFERENCES campaigns(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    points_value INTEGER NOT NULL,
    verification_type VARCHAR(50) NOT NULL,
    verification_data TEXT, -- JSON string
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    created_at DATETIME DEFAULT (datetime('now')),
    CHECK (points_value > 0),
    CHECK (end_date > start_date)
);

-- User Quest Completions table with enhanced constraints
CREATE TABLE user_quest_completions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id VARCHAR(42) REFERENCES users(id) ON DELETE CASCADE,
    quest_id INTEGER REFERENCES quests(id) ON DELETE CASCADE,
    points_earned INTEGER NOT NULL,
    completed_at DATETIME DEFAULT (datetime('now')),
    verification_proof TEXT, -- JSON string
    CHECK (points_earned > 0),
    UNIQUE(user_id, quest_id)
);

-- User Points table with enhanced constraints
CREATE TABLE user_points (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id VARCHAR(42) REFERENCES users(id) ON DELETE CASCADE,
    campaign_id INTEGER REFERENCES campaigns(id) ON DELETE CASCADE,
    total_points INTEGER NOT NULL DEFAULT 0,
    prediction_points INTEGER NOT NULL DEFAULT 0,
    quest_points INTEGER NOT NULL DEFAULT 0,
    last_updated DATETIME DEFAULT (datetime('now')),
    CHECK (total_points >= 0 AND prediction_points >= 0 AND quest_points >= 0),
    CHECK (total_points = prediction_points + quest_points),
    UNIQUE(user_id, campaign_id)
);

-- Views for common queries
CREATE VIEW campaign_leaderboard AS
SELECT 
    u.username,
    u.avatar,
    up.campaign_id,
    up.total_points,
    up.prediction_points,
    up.quest_points,
    (
        SELECT COUNT(*) + 1 
        FROM user_points up2 
        WHERE up2.campaign_id = up.campaign_id 
        AND up2.total_points > up.total_points
    ) as rank
FROM user_points up
JOIN users u ON u.id = up.user_id;

CREATE VIEW all_time_leaderboard AS
WITH ranked_users AS (
    SELECT 
        u.id as user_id,
        u.username,
        u.avatar,
        SUM(up.total_points) as total_points,
        SUM(up.prediction_points) as prediction_points,
        SUM(up.quest_points) as quest_points,
        ROW_NUMBER() OVER (ORDER BY SUM(up.total_points) DESC) as rank
    FROM user_points up
    JOIN users u ON u.id = up.user_id
    GROUP BY u.id, u.username, u.avatar
)
SELECT * FROM ranked_users;

CREATE VIEW team_fan_distribution AS
SELECT 
    t.name as team_name,
    s.name as sport_name,
    COUNT(uft.user_id) as fan_count
FROM teams t
JOIN sports s ON s.id = t.sport_id
LEFT JOIN user_favorite_teams uft ON uft.team_id = t.id
GROUP BY t.id, t.name, s.name;

-- Indexes for efficient queries
CREATE INDEX idx_user_predictions_user_id ON user_predictions(user_id);
CREATE INDEX idx_user_predictions_game_id ON user_predictions(game_id);
CREATE INDEX idx_user_points_campaign_total ON user_points(campaign_id, total_points);
CREATE INDEX idx_games_campaign_id ON games(campaign_id);
CREATE INDEX idx_games_status ON games(status);
CREATE INDEX idx_user_favorites_team_id ON user_favorite_teams(team_id);
CREATE INDEX idx_user_favorites_sport_id ON user_favorite_sports(sport_id);
CREATE INDEX idx_user_social_accounts_platform ON user_social_accounts(platform, platform_user_id);

-- Indexes for team and sport joins
CREATE INDEX idx_games_home_team_id ON games(home_team_id);
CREATE INDEX idx_games_away_team_id ON games(away_team_id);
CREATE INDEX idx_games_sport_id ON games(sport_id);
CREATE INDEX idx_teams_sport_id ON teams(sport_id);

-- New composite index for efficient user prediction queries
CREATE INDEX idx_user_predictions_user_game ON user_predictions(user_id, game_id);

-- New view for user predictions with game details
CREATE VIEW user_predictions_with_game_details AS
SELECT 
    up.id,
    up.user_id,
    up.game_id,
    up.predicted_winner_id,
    up.points_earned,
    up.created_at,
    g.start_time,
    g.status as game_status,
    g.points_value,
    ht.name as home_team_name,
    at.name as away_team_name,
    wt.name as predicted_winner_name
FROM user_predictions up
JOIN games g ON up.game_id = g.id
JOIN teams ht ON g.home_team_id = ht.id
JOIN teams at ON g.away_team_id = at.id
JOIN teams wt ON up.predicted_winner_id = wt.id;
