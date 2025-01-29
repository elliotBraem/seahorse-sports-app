-- Insert sports
INSERT INTO sports (id, name, description, abbreviation, external_id) VALUES (1, 'Football', 'American Football', 'NFL', 'NFL');

-- Insert teams
INSERT INTO teams (sport_id, name, abbreviation, external_id, api_metadata) VALUES (1, 'Philadelphia Eagles', 'PHI', 'PHI', '{"location":"Philadelphia, Pennsylvania","colors":{"primary":"#004C54","secondary":"#A5ACAF"},"conference":"NFC","division":"NFC East"}');
INSERT INTO teams (sport_id, name, abbreviation, external_id, api_metadata) VALUES (1, 'Washington Commanders', 'WAS', 'WAS', '{"location":"Landover, Maryland","colors":{"primary":"#5A1414","secondary":"#FFB612"},"conference":"NFC","division":"NFC East"}');
INSERT INTO teams (sport_id, name, abbreviation, external_id, api_metadata) VALUES (1, 'Kansas City Chiefs', 'KC', 'KC', '{"location":"Kansas City, Missouri","colors":{"primary":"#E31837","secondary":"#FFB612"},"conference":"AFC","division":"AFC West"}');
INSERT INTO teams (sport_id, name, abbreviation, external_id, api_metadata) VALUES (1, 'Buffalo Bills', 'BUF', 'BUF', '{"location":"Orchard Park, New York","colors":{"primary":"#00338D","secondary":"#C60C30"},"conference":"AFC","division":"AFC East"}');
INSERT INTO teams (sport_id, name, abbreviation, external_id) VALUES (1, 'Chicago Bears', 'CHI', 'CHI');

-- Insert the current campaign
INSERT INTO campaigns (name, description, start_date, end_date, status) VALUES ('The Big Game', 'Predict the winner of the big game', '2025-01-01', '2025-02-09', 'active');

-- Insert sample users (using example wallet addresses)
INSERT INTO users (id, username, email, avatar) VALUES ('0x1234567890123456789012345678901234567890', 'bills_fan', 'bills@example.com', 'https://example.com/avatar1.jpg');
INSERT INTO users (id, username, email, avatar) VALUES ('bearslover.testnst', 'bears_lover', 'bears@example.com', 'https://example.com/avatar2.jpg');
INSERT INTO users (id, username, email, avatar) VALUES ('0x4444444444444444444444444444444444444444', 'taylors_butthole', 'chiefs@example.com', 'https://example.com/avatar4.jpg');

-- Insert user favorite teams
INSERT INTO user_favorite_teams (user_id, team_id) VALUES ('0x1234567890123456789012345678901234567890', 4);
INSERT INTO user_favorite_teams (user_id, team_id) VALUES ('bearslover.testnst', 5);
INSERT INTO user_favorite_teams (user_id, team_id) VALUES ('0x4444444444444444444444444444444444444444', 3);

-- Insert user favorite sports
INSERT INTO user_favorite_sports (user_id, sport_id) VALUES ('0x1234567890123456789012345678901234567890', 1);
INSERT INTO user_favorite_sports (user_id, sport_id) VALUES ('bearslover.testnst', 1);
INSERT INTO user_favorite_sports (user_id, sport_id) VALUES ('0x4444444444444444444444444444444444444444', 1);

-- Insert the big game
INSERT INTO games (campaign_id, sport_id, home_team_id, away_team_id, start_time, game_type, points_value, status, api_metadata) 
VALUES (1, 1, 1, 3, '2025-02-09 18:30:00', 'superbowl', 30, 'upcoming',
  '{"location": "Caesars Superdome, New Orleans, Louisiana"}');

-- Insert quests
INSERT INTO quests (campaign_id, name, description, points_value, verification_type, verification_data, start_date, end_date) 
VALUES (1, 'Follow us', 'Follow @rngfanclub on X', 10, 'social_follow', 
  '{"platform": "twitter", "action": "follow", "intent_url": "https://twitter.com/intent/follow?screen_name=rngfanclub"}',
  '2025-01-01', '2025-02-09');

INSERT INTO quests (campaign_id, name, description, points_value, verification_type, verification_data, start_date, end_date) 
VALUES (1, 'Predict the big game', 'Who will win the big game?', 30, 'prediction',
  '{"game_id": 1, "game_link": "/games/1", "game_type": "superbowl"}',
  '2025-01-01', '2025-02-09');

-- Insert quest completions (varied completion rates)
-- bills_fan completes twitter follow
INSERT INTO user_quest_completions (user_id, quest_id, points_earned) VALUES ('0x1234567890123456789012345678901234567890', 1, 10);

-- bears_lover completes twitter follow
INSERT INTO user_quest_completions (user_id, quest_id, points_earned) VALUES ('bearslover.testnst', 1, 10);

-- taylors_butthole completes twitter follow
INSERT INTO user_quest_completions (user_id, quest_id, points_earned) VALUES ('0x4444444444444444444444444444444444444444', 1, 10);

-- Initialize user points
INSERT INTO user_points (user_id, campaign_id, total_points, prediction_points, quest_points) VALUES ('0x1234567890123456789012345678901234567890', 1, 10, 0, 10);
INSERT INTO user_points (user_id, campaign_id, total_points, prediction_points, quest_points) VALUES ('bearslover.testnst', 1, 10, 0, 10);
INSERT INTO user_points (user_id, campaign_id, total_points, prediction_points, quest_points) VALUES ('0x4444444444444444444444444444444444444444', 1, 10, 0, 10);
