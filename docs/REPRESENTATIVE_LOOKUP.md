# Representative Lookup System

## Architecture

The representative lookup system uses **only our verified database** as the source of truth. No external APIs are called during lookup.

### How It Works

1. **User enters ZIP code** → System maps ZIP to state using first 3 digits
2. **Query database** → Return ALL House members + Senators for that state
3. **User selects district** → UI allows user to confirm their House district from the list

### Why This Approach?

**Removed unreliable APIs:**
- ❌ Google Civic Information API (deprecated April 2025)
- ❌ whoismyrepresentative.com (returns outdated data like Bobby Rush instead of Jonathan Jackson)

**Benefits:**
- ✅ Complete data integrity control
- ✅ No API rate limits or downtime
- ✅ Accurate, government-verified data
- ✅ Fast queries (< 50ms from database)
- ✅ Privacy-focused (no external data sharing)

### Data Freshness

- Initial population: Via Congress.gov API (`/api/populate-congress-data`)
- Updates: Post-election via Admin panel "Refresh Data" button
- Next scheduled update: January 2027 (after 2026 midterms)

### ZIP to State Mapping

Uses standard USPS ZIP prefix ranges (e.g., 600-629 = Illinois). This is a static mapping that doesn't change and requires no external API.

### Future Enhancement

For more precise district identification, we can add a static ZIP-to-district CSV file from Row Zero (free, updated for 119th Congress). This would allow automatic district selection instead of showing all state representatives.

## Database Schema

\`\`\`sql
congress_members (
  bioguide_id PRIMARY KEY,
  state, district, chamber, party,
  office_email, office_phone, dc_office_address,
  current_name, term_start, term_end
)
\`\`\`

Total size: ~150KB for 535 members
