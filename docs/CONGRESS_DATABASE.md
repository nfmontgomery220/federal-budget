# Congress Members Database

## Overview

FiscalClarity maintains its own database of Congressional representatives as the primary source of truth for representative lookups. This ensures:

- **Data Accuracy**: Verified, current information (e.g., Jonathan Jackson, not Bobby Rush)
- **Reliability**: No dependency on third-party API uptime
- **Stability**: Office contact information remains consistent across elections
- **Performance**: Fast local queries vs. external API calls

## Database Schema

**Table**: `congress_members` (~150KB for 575 members)

**Key Fields**:
- `bioguide_id`: Library of Congress permanent identifier (primary key)
- `office_email`: Stable congressional email (primary contact method)
- `current_name`: Member name (updated post-election)
- `state`, `district`, `chamber`: Geographic/legislative data

## Data Flow

1. **User enters ZIP code** → System determines congressional district
2. **Query local database** → Get current representatives from `congress_members`
3. **Return verified data** → Office emails, phones, addresses from official sources
4. **Fallback only if needed** → External APIs used only if database is empty

## Refreshing Data

### Initial Population

To populate the database for the first time:

1. **Run the SQL schema**: Execute `scripts/update-congress-members-schema.sql`
2. **Populate data**: Make a POST request to `/api/populate-congress-data`
   - Fetches all 119th Congress members from Congress.gov API
   - Takes ~2-3 minutes to complete (rate-limited)
   - Returns count of members added

### After Elections (Every 2 Years)

Run the same endpoint to update with new members:

\`\`\`bash
POST /api/populate-congress-data
\`\`\`

This fetches all current Congress members from Congress.gov API and updates the database.

## API Key

**Congress.gov API Key**: `2cV5vg8yEmz7gbHWEmTaCSN0Bcgw1CDA0AU7FJU3`

Store as environment variable: `CONGRESS_GOV_API_KEY`

## Storage Impact

- **Current**: ~150KB (575 members × ~260 bytes)
- **Growth**: Minimal (only changes with Congress size)
- **Optimization**: Indexes on `state`, `district`, `chamber` for fast lookups

## Benefits vs External APIs

| Feature | Our Database | External APIs |
|---------|-------------|---------------|
| Accuracy | Verified, current | Often outdated |
| Reliability | 100% uptime | Dependent on third-party |
| Performance | <10ms query | 200-500ms API call |
| Control | Full manual override | No control |
| Cost | ~150KB storage | Rate limits, potential fees |
