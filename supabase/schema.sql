-- Green Idea platform schema (Postgres/Supabase).
-- Already applied to the project's Supabase database directly; this file
-- exists so the schema is reproducible/reviewable from the repo instead
-- of only living in Supabase's dashboard history. To apply it to a new
-- project: Supabase Dashboard -> SQL Editor -> paste and run.

create table if not exists public.users (
    id bigint generated always as identity primary key,
    username varchar(100) not null unique,
    email varchar(255) not null unique,
    password_hash varchar(255) not null,
    created_at timestamptz not null default now()
);

create table if not exists public.password_reset_otps (
    id bigint generated always as identity primary key,
    email varchar(255) not null,
    otp varchar(10) not null,
    expires_at timestamp not null,
    is_used boolean not null default false,
    created_at timestamptz not null default now()
);
create index if not exists idx_password_reset_otps_email_otp on public.password_reset_otps (email, otp);

create table if not exists public.workers (
    id bigint generated always as identity primary key,
    name varchar(100) not null,
    age varchar(10) not null,
    city varchar(100) not null,
    district varchar(100) not null,
    panchayat varchar(100) not null,
    phone varchar(50) not null,
    created_at timestamptz not null default now()
);
create index if not exists idx_workers_panchayat on public.workers (panchayat);

create table if not exists public.transporters (
    id bigint generated always as identity primary key,
    name varchar(100) not null,
    phone varchar(50) not null,
    service_type varchar(100) not null,
    vehicle_type varchar(100) not null,
    district varchar(100) not null,
    city varchar(100) not null,
    location varchar(255) not null,
    available boolean not null default true,
    created_at timestamptz not null default now()
);
create index if not exists idx_transporters_filters on public.transporters (district, city, service_type, vehicle_type);

create table if not exists public.equipment_services (
    id bigint generated always as identity primary key,
    name varchar(100) not null,
    phone varchar(50) not null,
    equipment_name varchar(150) not null,
    equipment_type varchar(100) not null,
    district varchar(100) not null,
    city varchar(100) not null,
    price varchar(50) default '',
    image_url varchar(500) default '',
    available boolean not null default true,
    created_at timestamptz not null default now()
);
create index if not exists idx_equipment_services_filters on public.equipment_services (city, district);

-- Generic farming-service tables (irrigation / iot / pest_control).
-- "equipment" is deliberately excluded here: it already has its own
-- richer table above, and reusing this generic shape for it previously
-- caused two code paths to fight over one table with two different
-- column sets (see backend/app.py comments near ALLOWED_FARMING_SERVICES).
create table if not exists public.irrigation_services (
    id bigint generated always as identity primary key,
    name varchar(100) not null,
    phone varchar(50) not null,
    service_name varchar(150) not null,
    district varchar(100) not null,
    city varchar(100) not null,
    price varchar(50) default '',
    notes text default '',
    image_url varchar(500) default '',
    created_at timestamptz not null default now()
);

create table if not exists public.iot_services (
    id bigint generated always as identity primary key,
    name varchar(100) not null,
    phone varchar(50) not null,
    service_name varchar(150) not null,
    district varchar(100) not null,
    city varchar(100) not null,
    price varchar(50) default '',
    notes text default '',
    image_url varchar(500) default '',
    created_at timestamptz not null default now()
);

create table if not exists public.pest_control_services (
    id bigint generated always as identity primary key,
    name varchar(100) not null,
    phone varchar(50) not null,
    service_name varchar(150) not null,
    district varchar(100) not null,
    city varchar(100) not null,
    price varchar(50) default '',
    notes text default '',
    image_url varchar(500) default '',
    created_at timestamptz not null default now()
);

-- The Flask backend talks to Postgres directly with the database
-- credentials (not through PostgREST/anon key), so RLS isn't what
-- authorizes it. Enabled anyway with no policies as a safe default, so
-- these tables aren't silently readable/writable if the Supabase
-- auto-generated REST API is ever turned on for this project.
alter table public.users enable row level security;
alter table public.password_reset_otps enable row level security;
alter table public.workers enable row level security;
alter table public.transporters enable row level security;
alter table public.equipment_services enable row level security;
alter table public.irrigation_services enable row level security;
alter table public.iot_services enable row level security;
alter table public.pest_control_services enable row level security;

-- Storage bucket for equipment photos, used by the frontend directly
-- (see frontend/src/lib/supabaseClient.js) via the public anon key.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('equipment-images', 'equipment-images', true, 5242880, array['image/jpeg','image/png','image/webp','image/gif'])
on conflict (id) do nothing;

create policy "Public read equipment images"
on storage.objects for select
to public
using (bucket_id = 'equipment-images');

create policy "Public upload equipment images"
on storage.objects for insert
to public
with check (bucket_id = 'equipment-images');
