# Bzzy Landscaping Marketplace

A full-stack marketplace application connecting clients with 
local landscaping providers. Clients discover and filter providers 
by service type, location, and price. Providers manage their 
profiles, services, availability, and business details.

> This is a public showcase repository. Sensitive business 
> logic, credentials, and proprietary implementation details 
> are maintained in a private repository.

---

## What It Does

**For clients:**
- Search and filter local service providers by service type, 
  location, and max price
- Browse provider profiles with portfolio photos, pricing, 
  and service listings
- Save search history for personalized recommendations

**For providers:**
- Manage business profile, services, and availability
- List services with fixed or quote-based pricing
- Upload portfolio photos and business media

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React Native + Expo + TypeScript |
| Navigation | Expo Router |
| Backend | FastAPI (Python) |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Storage | Supabase Storage (profile pics, banners, portfolio) |
| Security | Row Level Security (RLS) on all tables |

---

## Current State

### Built & Working
- Mobile app client discovery and provider search flow
- Service filtering by type, location, and price
- Supabase auth with role-based user logic (client, 
  contractor, admin, developer)
- Automatic profile creation on signup via database trigger
- Provider profiles with service listings and portfolio photos
- FastAPI backend with health check and provider endpoints
- Full PostgreSQL schema with RLS policies on all tables
- Supabase Storage buckets for profile pics, banners, 
  and portfolio media

### In Progress / Planned
- Scheduling and job management workflows
- Payment integration
- Messaging and quoting flows
- Admin dashboard and analytics
- Onboarding automation
- Production deployment and hardening

---

## Architecture Highlights

### Authentication & Role System
User roles (client, contractor, admin, developer) are 
assigned automatically at signup via a PostgreSQL trigger 
(`handle_new_user`). Roles determine access across the 
entire application through Supabase RLS policies — no 
role logic lives in the frontend.

```sql
-- Automatic profile + role assignment on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
```

### Row Level Security
Every table has RLS enabled. Users can only read and write 
their own data. Admin and developer roles are granted 
elevated access via a security-definer function.

```sql
create policy profiles_update on public.profiles
  for update to authenticated
  using (id = auth.uid() or public.is_admin_or_dev())
  with check (id = auth.uid() or public.is_admin_or_dev());
```

### Client Search with Persistent History
Search queries are saved to `client_service_searches` 
with full context (service, location, max price) for 
future personalization and analytics.

### Provider Filtering (Frontend)
Filtering runs client-side after a Supabase join query 
pulls providers with their services in a single request — 
minimizing round trips while keeping the query layer simple.

---

## Database Schema (Simplified)

profiles — user accounts + roles
provider_profiles — business info, bio, media
provider_services — service listings + pricing
provider_availability — weekly availability (JSONB)
client_service_searches — saved search history
task_workflows — job/task lifecycle management


---

## Sample: ClientSearch Component

The core discovery screen — queries Supabase directly 
from the frontend, applies client-side filters, and 
saves search history for authenticated users.

```typescript
// Filter providers by selected service type
results = results.filter((provider) =>
  provider.provider_services?.some(
    (service) =>
      service.service_name.toLowerCase() === 
      selectedService.toLowerCase()
  )
);
```

---

## Sample: FastAPI Backend

```python
@router.get("/providers")
def list_providers(
    service: Optional[str] = Query(default=None),
    location: Optional[str] = Query(default=None),
    max_price: Optional[float] = Query(default=None),
):
    ...
```
---

## Status

**Active development** — core marketplace flow is 
functional. Production deployment, payments, and 
scheduling workflows are next.

The private repository contains full implementation 
details. Code samples and architecture walkthroughs 
available upon request.

---

## License

AGPL — see [LICENSE](LICENSE)

---

*Built by [Brian Brower](https://brianbrower.me) · 
[GitHub](https://github.com/bbrower33) · 
[LinkedIn](https://linkedin.com/in/brian-brower-8a2b97265)*
