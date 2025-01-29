# Database Management

## Initial Deploy

### Development

```bash
# Deploy schema to development
wrangler d1 execute seahorse-sports-dev --file=./schema.sql
```

### Production

```bash
# Deploy schema to production
wrangler d1 execute seahorse-sports-prod --file=./schema.sql --env production
```

## Making Schema Changes

1. First modify `schema.sql` with your changes

2. Create a new migration:

```bash
# Create migration file
wrangler d1 migrations create seahorse-sports-dev "description_of_changes"
```

3. Add your changes to the new migration file in `migrations/`

4. Apply migration to development:

```bash
wrangler d1 migrations apply seahorse-sports-dev
```

5. After testing, apply to production:

```bash
wrangler d1 migrations apply seahorse-sports-prod --env production
```

## Common Commands

### View Data

```bash
# Development
wrangler d1 execute seahorse-sports-dev --command="SELECT * FROM users"

# Production
wrangler d1 execute seahorse-sports-prod --command="SELECT * FROM users" --env production
```

### Backup Database

```bash
# Development
wrangler d1 backup seahorse-sports-dev

# Production
wrangler d1 backup seahorse-sports-prod --env production
```

### List Migrations

```bash
# Development
wrangler d1 migrations list seahorse-sports-dev

# Production
wrangler d1 migrations list seahorse-sports-prod --env production
```

## Tips

- Always test changes in development first
- Back up production database before applying migrations
- Keep migrations small and focused
- Version control all schema changes
- Use transactions in migrations when possible
