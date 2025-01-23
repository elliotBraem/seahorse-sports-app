# Renegade Fanclub API

A Cloudflare Worker API for managing sports predictions, campaigns, and user engagement.

## Features

- User authentication and profile management
- Campaign and game tracking
- Predictions and points system
- Quest completion and verification
- Social account integration
- Comprehensive leaderboard system

## API Documentation

### Public Endpoints

#### Campaigns

- `GET /api/campaigns` - List all campaigns
- `GET /api/campaigns/:id` - Get campaign details
- `GET /api/campaigns/:id/leaderboard` - Get campaign leaderboard

#### Games

- `GET /api/games` - List all games
- `GET /api/games/:id` - Get game details
- `GET /api/games/current` - Get active games

#### Teams

- `GET /api/teams` - List all teams
- `GET /api/teams/:id` - Get team details
- `GET /api/teams/:id/fans` - Get team fan count

#### Leaderboards

- `GET /api/leaderboard/all-time` - Get all-time leaderboard
- `GET /api/leaderboard/:campaignId` - Get campaign-specific leaderboard

### Protected Endpoints (Require Authentication)

#### User Profile

- `GET /api/user/profile` - Get user profile
- `PATCH /api/user/profile` - Update profile
- `POST /api/user/favorites/teams` - Add favorite team
- `DELETE /api/user/favorites/teams/:teamId` - Remove favorite team

#### Predictions

- `POST /api/predictions` - Make a prediction
- `GET /api/predictions/mine` - Get user's predictions
- `GET /api/predictions/:gameId` - Get specific prediction

#### Quests

- `GET /api/quests` - List available quests
- `POST /api/quests/:questId/complete` - Complete a quest
- `GET /api/quests/mine` - Get user's completed quests

#### Social Accounts

- `POST /api/user/social` - Link social account
- `DELETE /api/user/social/:platform` - Unlink social account
- `GET /api/user/social` - Get linked social accounts

### Admin Endpoints (Require Admin Authentication)

#### Campaign Management

- `POST /api/admin/campaigns` - Create campaign
- `PATCH /api/admin/campaigns/:id` - Update campaign
- `DELETE /api/admin/campaigns/:id` - Delete campaign

#### Game Management

- `POST /api/admin/games` - Create game
- `PATCH /api/admin/games/:id` - Update game (including setting winners)
- `DELETE /api/admin/games/:id` - Delete game

#### Quest Management

- `POST /api/admin/quests` - Create quest
- `PATCH /api/admin/quests/:id` - Update quest
- `DELETE /api/admin/quests/:id` - Delete quest

## Technical Details

### Authentication

All protected endpoints require a Bearer token in the Authorization header:

```txt
Authorization: Bearer <token>
```

### Rate Limiting

- Public endpoints: 60 requests per minute
- Admin endpoints: 120 requests per minute
- Rate limit headers included in responses:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`

### Response Formats

Success Response:

```json
{
  "success": true,
  "data": {
    // response data
  }
}
```

Error Response:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message"
  }
}
```

### CORS

All endpoints support CORS with the following headers:

- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type, Authorization`
- `Access-Control-Max-Age: 86400`

### Pagination

List endpoints support pagination with the following query parameters:

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

Response includes:

```json
{
  "success": true,
  "data": {
    "items": [...],
    "total": 100,
    "page": 1,
    "limit": 10,
    "pages": 10
  }
}
```
