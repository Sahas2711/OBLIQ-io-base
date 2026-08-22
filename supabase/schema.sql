-- OBLIQ-io Database Schema
-- Run this in your Supabase SQL editor

-- ─── Firms ───
create table firms (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

-- ─── User Profiles (extends Supabase auth.users) ───
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  firm_id uuid not null references firms(id) on delete cascade,
  full_name text not null,
  email text not null,
  role text not null default 'member' check (role in ('partner', 'manager', 'member')),
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─── Clients ───
create table clients (
  id uuid primary key default gen_random_uuid(),
  firm_id uuid not null references firms(id) on delete cascade,
  name text not null,
  email text,
  phone text,
  pan text,
  entity_type text not null default 'company' check (entity_type in ('individual', 'company', 'partnership', 'llp', 'huf', 'trust')),
  status text not null default 'active' check (status in ('active', 'inactive', 'onboarding')),
  firm_name text,
  assigned_to uuid references profiles(id),
  compliance_types text[] not null default '{}',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─── Compliance Tasks ───
create table compliance_tasks (
  id uuid primary key default gen_random_uuid(),
  firm_id uuid not null references firms(id) on delete cascade,
  client_id uuid not null references clients(id) on delete cascade,
  title text not null,
  description text,
  category text not null check (category in ('gst', 'income_tax', 'tds', 'roc', 'audit', 'kyc', 'financial_statements')),
  status text not null default 'not_started' check (status in ('not_started', 'in_progress', 'awaiting_documents', 'under_review', 'completed', 'overdue')),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'urgent')),
  assigned_to uuid references profiles(id),
  due_date date not null,
  completed_at timestamptz,
  financial_year text,
  period text,
  document_required boolean not null default false,
  documents_uploaded integer not null default 0,
  documents_total integer not null default 0,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─── Documents ───
create table documents (
  id uuid primary key default gen_random_uuid(),
  firm_id uuid not null references firms(id) on delete cascade,
  client_id uuid not null references clients(id) on delete cascade,
  task_id uuid references compliance_tasks(id) on delete set null,
  name text not null,
  type text not null,
  status text not null default 'requested' check (status in ('requested', 'uploaded', 'approved', 'rejected', 'expired')),
  uploaded_by text,
  uploaded_at timestamptz,
  requested_at timestamptz not null default now(),
  due_date date,
  file_size text,
  created_at timestamptz not null default now()
);

-- ─── Activity Log ───
create table activities (
  id uuid primary key default gen_random_uuid(),
  firm_id uuid not null references firms(id) on delete cascade,
  user_id uuid references profiles(id),
  user_name text not null,
  action text not null,
  description text not null,
  client_id uuid references clients(id) on delete set null,
  client_name text,
  is_ai boolean not null default false,
  created_at timestamptz not null default now()
);

-- ─── Task Notes ───
create table task_notes (
  id uuid primary key default gen_random_uuid(),
  firm_id uuid not null references firms(id) on delete cascade,
  task_id uuid not null references compliance_tasks(id) on delete cascade,
  user_id uuid references profiles(id),
  user_name text not null,
  content text not null,
  created_at timestamptz not null default now()
);

-- ─── Client Notes ───
create table client_notes (
  id uuid primary key default gen_random_uuid(),
  firm_id uuid not null references firms(id) on delete cascade,
  client_id uuid not null references clients(id) on delete cascade,
  user_id uuid references profiles(id),
  user_name text not null,
  content text not null,
  created_at timestamptz not null default now()
);

-- ─── Indexes ───
create index idx_clients_firm on clients(firm_id);
create index idx_clients_status on clients(firm_id, status);
create index idx_tasks_firm on compliance_tasks(firm_id);
create index idx_tasks_client on compliance_tasks(client_id);
create index idx_tasks_status on compliance_tasks(firm_id, status);
create index idx_tasks_due on compliance_tasks(firm_id, due_date);
create index idx_documents_firm on documents(firm_id);
create index idx_documents_client on documents(client_id);
create index idx_activities_firm on activities(firm_id, created_at desc);
create index idx_task_notes_task on task_notes(task_id);
create index idx_client_notes_client on client_notes(client_id);

-- ─── Row Level Security ───
alter table clients enable row level security;
alter table compliance_tasks enable row level security;
alter table documents enable row level security;
alter table activities enable row level security;
alter table task_notes enable row level security;
alter table client_notes enable row level security;
alter table profiles enable row level security;

-- Policies: Users can only access data from their own firm
create policy "Users can view own firm clients" on clients
  for select using (firm_id = (select firm_id from profiles where id = auth.uid()));

create policy "Users can insert own firm clients" on clients
  for insert with check (firm_id = (select firm_id from profiles where id = auth.uid()));

create policy "Users can update own firm clients" on clients
  for update using (firm_id = (select firm_id from profiles where id = auth.uid()));

create policy "Users can view own firm tasks" on compliance_tasks
  for select using (firm_id = (select firm_id from profiles where id = auth.uid()));

create policy "Users can insert own firm tasks" on compliance_tasks
  for insert with check (firm_id = (select firm_id from profiles where id = auth.uid()));

create policy "Users can update own firm tasks" on compliance_tasks
  for update using (firm_id = (select firm_id from profiles where id = auth.uid()));

create policy "Users can delete own firm tasks" on compliance_tasks
  for delete using (firm_id = (select firm_id from profiles where id = auth.uid()));

create policy "Users can view own firm documents" on documents
  for select using (firm_id = (select firm_id from profiles where id = auth.uid()));

create policy "Users can insert own firm documents" on documents
  for insert with check (firm_id = (select firm_id from profiles where id = auth.uid()));

create policy "Users can update own firm documents" on documents
  for update using (firm_id = (select firm_id from profiles where id = auth.uid()));

create policy "Users can view own firm activities" on activities
  for select using (firm_id = (select firm_id from profiles where id = auth.uid()));

create policy "Users can insert own firm activities" on activities
  for insert with check (firm_id = (select firm_id from profiles where id = auth.uid()));

create policy "Users can view own firm task notes" on task_notes
  for select using (firm_id = (select firm_id from profiles where id = auth.uid()));

create policy "Users can insert own firm task notes" on task_notes
  for insert with check (firm_id = (select firm_id from profiles where id = auth.uid()));

create policy "Users can view own firm client notes" on client_notes
  for select using (firm_id = (select firm_id from profiles where id = auth.uid()));

create policy "Users can insert own firm client notes" on client_notes
  for insert with check (firm_id = (select firm_id from profiles where id = auth.uid()));

create policy "Users can view own profile" on profiles
  for select using (id = auth.uid());

create policy "Users can update own profile" on profiles
  for update using (id = auth.uid());
