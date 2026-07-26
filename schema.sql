create extension if not exists "pgcrypto";

create table if not exists admins (
  id uuid primary key default gen_random_uuid(),
  nama text not null,
  email text unique not null,
  password_hash text not null,
  created_at timestamptz default now()
);

create table if not exists contents (
  id uuid primary key default gen_random_uuid(),
  judul text not null,
  tipe text not null check (tipe in ('image', 'video', 'url')),
  payload_url text not null,
  created_at timestamptz default now()
);

create table if not exists devices (
  id uuid primary key default gen_random_uuid(),
  nama text not null,
  lokasi text not null,
  status text not null default 'offline' check (status in ('online', 'offline')),
  current_content_id uuid references contents(id) on delete set null,
  mode text not null default 'single' check (mode in ('single', 'playlist')),
  ws_token uuid not null default gen_random_uuid(),
  last_seen timestamptz default now()
);

create index if not exists idx_devices_status on devices(status);
create index if not exists idx_devices_current_content on devices(current_content_id);

create table if not exists playlist_items (
  id uuid primary key default gen_random_uuid(),
  device_id uuid not null references devices(id) on delete cascade,
  content_id uuid not null references contents(id) on delete cascade,
  urutan integer not null default 0,
  durasi_detik integer not null default 10 check (durasi_detik > 0),
  created_at timestamptz default now()
);

create index if not exists idx_playlist_items_device_urutan on playlist_items(device_id, urutan);

create table if not exists pairing_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'expired')),
  device_id uuid references devices(id) on delete cascade,
  ws_token uuid,
  expires_at timestamptz not null default (now() + interval '10 minutes'),
  created_at timestamptz default now()
);

create index if not exists idx_pairing_codes_status on pairing_codes(status);
create index if not exists idx_pairing_codes_code on pairing_codes(code);

alter table devices add column if not exists mode text not null default 'single' check (mode in ('single', 'playlist'));
alter table devices add column if not exists ws_token uuid not null default gen_random_uuid();
create unique index if not exists idx_devices_ws_token on devices(ws_token);

alter table devices add column if not exists paired boolean not null default false;
create index if not exists idx_devices_paired on devices(paired);