-- Insert sports
INSERT INTO sports (id, name, description, abbreviation, external_id) VALUES (1, 'Football', 'American Football', 'NFL', 'NFL');
INSERT INTO sports (id, name, description, abbreviation, external_id) VALUES (2, 'Basketball', 'Professional Basketball', 'NBA', 'NBA');

-- Insert teams
INSERT INTO teams (sport_id, name, abbreviation, external_id) VALUES (1, 'Philadelphia Eagles', 'PHI', 'PHI');
INSERT INTO teams (sport_id, name, abbreviation, external_id) VALUES (1, 'Washington Commanders', 'WAS', 'WAS');
INSERT INTO teams (sport_id, name, abbreviation, external_id) VALUES (1, 'Kansas City Chiefs', 'KC', 'KC');
INSERT INTO teams (sport_id, name, abbreviation, external_id) VALUES (1, 'Buffalo Bills', 'BUF', 'BUF');
INSERT INTO teams (sport_id, name, abbreviation, external_id) VALUES (1, 'Chicago Bears', 'CHI', 'CHI');
INSERT INTO teams (sport_id, name, abbreviation, external_id) VALUES (2, 'Denver Nuggets', 'DEN', 'DEN');
INSERT INTO teams (sport_id, name, abbreviation, external_id) VALUES (2, 'Los Angeles Lakers', 'LAL', 'LAL');

-- Insert the current campaign
INSERT INTO campaigns (name, description, start_date, end_date, status) VALUES ('The Big Game', 'NFL Championship Predictions', '2025-01-01', '2025-02-09', 'active');

-- Insert sample users (using example wallet addresses)
INSERT INTO users (id, username, email, avatar) VALUES ('0x1234567890123456789012345678901234567890', 'bills_fan', 'bills@example.com', 'https://example.com/avatar1.jpg');
INSERT INTO users (id, username, email, avatar) VALUES ('bearslover.testnst', 'bears_lover', 'bears@example.com', 'https://example.com/avatar2.jpg');
INSERT INTO users (id, username, email, avatar) VALUES ('0x3456789012345678901234567890123456789012', 'hoops_only', 'hoops@example.com', 'https://example.com/avatar3.jpg');
INSERT INTO users (id, username, email, avatar) VALUES ('0x4444444444444444444444444444444444444444', 'taylors_butthole', 'chiefs@example.com', 'https://example.com/avatar4.jpg');

-- Insert user favorite teams
INSERT INTO user_favorite_teams (user_id, team_id) VALUES ('0x1234567890123456789012345678901234567890', 4);
INSERT INTO user_favorite_teams (user_id, team_id) VALUES ('bearslover.testnst', 5);
INSERT INTO user_favorite_teams (user_id, team_id) VALUES ('0x4444444444444444444444444444444444444444', 3);

-- Insert user favorite sports
INSERT INTO user_favorite_sports (user_id, sport_id) VALUES ('0x1234567890123456789012345678901234567890', 1);
INSERT INTO user_favorite_sports (user_id, sport_id) VALUES ('bearslover.testnst', 1);
INSERT INTO user_favorite_sports (user_id, sport_id) VALUES ('bearslover.testnst', 2);
INSERT INTO user_favorite_sports (user_id, sport_id) VALUES ('0x3456789012345678901234567890123456789012', 2);
INSERT INTO user_favorite_sports (user_id, sport_id) VALUES ('0x4444444444444444444444444444444444444444', 1);

-- Insert upcoming games
INSERT INTO games (campaign_id, sport_id, home_team_id, away_team_id, start_time, game_type, points_value, status) VALUES (1, 1, 1, 2, '2025-01-28 13:00:00', 'regular_season', 10, 'upcoming');
INSERT INTO games (campaign_id, sport_id, home_team_id, away_team_id, start_time, game_type, points_value, status) VALUES (1, 1, 3, 4, '2025-01-28 16:30:00', 'regular_season', 10, 'upcoming');
INSERT INTO games (campaign_id, sport_id, home_team_id, away_team_id, start_time, game_type, points_value, status) VALUES (1, 1, NULL, NULL, '2025-02-09 18:30:00', 'superbowl', 30, 'upcoming');

-- Insert quests
INSERT INTO quests (campaign_id, name, description, points_value, verification_type, start_date, end_date) VALUES (1, 'Follow RenegadeFanClub', 'Follow @rngfanclub on Twitter', 5, 'social_follow', '2025-01-01', '2025-02-09');
INSERT INTO quests (campaign_id, name, description, points_value, verification_type, start_date, end_date) VALUES (1, 'Share Prediction', 'Share your prediction on Twitter', 10, 'social_share', '2025-01-01', '2025-02-09');
INSERT INTO quests (campaign_id, name, description, points_value, verification_type, start_date, end_date) VALUES (1, 'Weekend Games Pick', 'Predict winners for this weekend''s games', 15, 'prediction', '2025-01-01', '2025-01-28');
INSERT INTO quests (campaign_id, name, description, points_value, verification_type, start_date, end_date) VALUES (1, 'Super Bowl Pick', 'Predict the Super Bowl winner', 20, 'prediction', '2025-01-29', '2025-02-09');
INSERT INTO quests (campaign_id, name, description, points_value, verification_type, start_date, end_date) VALUES (1, 'Smart Contract Verification', 'Verify transaction with smart contract', 25, 'blockchain', '2025-01-01', '2025-02-09');

-- Insert user predictions (randomized, not all users participating)
INSERT INTO user_predictions (user_id, game_id, predicted_winner_id) VALUES ('0x1234567890123456789012345678901234567890', 1, 1);
INSERT INTO user_predictions (user_id, game_id, predicted_winner_id) VALUES ('0x1234567890123456789012345678901234567890', 2, 4);
INSERT INTO user_predictions (user_id, game_id, predicted_winner_id) VALUES ('bearslover.testnst', 1, 2);
INSERT INTO user_predictions (user_id, game_id, predicted_winner_id) VALUES ('0x4444444444444444444444444444444444444444', 2, 3);

-- Insert quest completions (varied completion rates)
-- bills_fan completes all quests
INSERT INTO user_quest_completions (user_id, quest_id, points_earned) VALUES ('0x1234567890123456789012345678901234567890', 1, 5);
INSERT INTO user_quest_completions (user_id, quest_id, points_earned) VALUES ('0x1234567890123456789012345678901234567890', 2, 10);
INSERT INTO user_quest_completions (user_id, quest_id, points_earned) VALUES ('0x1234567890123456789012345678901234567890', 3, 15);
INSERT INTO user_quest_completions (user_id, quest_id, points_earned) VALUES ('0x1234567890123456789012345678901234567890', 5, 25);

-- bears_lover completes one quest
INSERT INTO user_quest_completions (user_id, quest_id, points_earned) VALUES ('bearslover.testnst', 1, 5);

-- taylors_butthole completes some quests but will be wrong about predictions
INSERT INTO user_quest_completions (user_id, quest_id, points_earned) VALUES ('0x4444444444444444444444444444444444444444', 1, 5);
INSERT INTO user_quest_completions (user_id, quest_id, points_earned) VALUES ('0x4444444444444444444444444444444444444444', 2, 10);
INSERT INTO user_quest_completions (user_id, quest_id, points_earned) VALUES ('0x4444444444444444444444444444444444444444', 3, 15);

-- hoops_only completes no quests

-- Initialize user points
INSERT INTO user_points (user_id, campaign_id, total_points, prediction_points, quest_points) VALUES ('0x1234567890123456789012345678901234567890', 1, 55, 0, 55);
INSERT INTO user_points (user_id, campaign_id, total_points, prediction_points, quest_points) VALUES ('bearslover.testnst', 1, 5, 0, 5);
INSERT INTO user_points (user_id, campaign_id, total_points, prediction_points, quest_points) VALUES ('0x3456789012345678901234567890123456789012', 1, 0, 0, 0);
INSERT INTO user_points (user_id, campaign_id, total_points, prediction_points, quest_points) VALUES ('0x4444444444444444444444444444444444444444', 1, 30, 0, 30);
