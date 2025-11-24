# Data Collection Policy

## Core Principle
**Collect only what we use. Store only what we analyze.**

## Current Storage (Optimized)

### Essential Data We Keep Forever
1. **Budget Sessions** - Final balanced budgets users created
2. **Budget Configs** - The actual numbers (spending/revenue choices)
3. **User Feedback** - Optional survey responses (political affiliation, comments)
4. **Congress Contacts** - When users sent proposals to representatives

### Temporary Data (90-day retention)
- **User Interactions** - Only major events (started, completed, generated proposal)
- Granular slider movements are NOT tracked

### What We DON'T Collect
- IP addresses or device fingerprints
- Browser history or tracking cookies
- Real names, emails, or personal identifiers
- Social media profiles
- Exact timestamps (rounded to hour)

## Storage Projections

| Users | Sessions | Storage | Monthly Cost (Supabase) |
|-------|----------|---------|------------------------|
| 10K   | 10K      | 50 MB   | Free tier              |
| 100K  | 100K     | 500 MB  | Free tier              |
| 1M    | 1M       | 5 GB    | $25/month              |

## Congress Contact Feature

**What We Track:**
- Which representative received a proposal (by ID, not name)
- When it was sent (date only, not exact time)
- User's ZIP code (for geographic heatmap)
- Method used (email/copy/download)

**What We Show Publicly:**
- "X constituents from [state] have contacted Rep. [Name]"
- Aggregated deficit proposals sent to each member
- Geographic heatmap of engagement

**Privacy Protection:**
- No individual proposals are identifiable
- No user can be linked to a specific representative contact
- Aggregate stats updated hourly, not real-time

## Data Deletion

Users can request full deletion via contact@fiscalclarity.info. All associated:
- Budget sessions
- Feedback responses  
- Contact records

...are permanently removed within 48 hours.

---

**Last Updated:** July 4, 2025
