-- MacroTrack Database Schema Migration

-- Create a table for user profiles to extend the default auth.users
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  target_weight numeric(5, 2), -- in lbs
  activity_level text, -- e.g., 'sedentary', 'moderate', 'active'
  primary_goal text, -- e.g., 'cut', 'maintenance', 'bulk'
  avatar_url text,
  height numeric(5, 2), -- in inches or cm
  sex text,
  dob date,
  selected_program_split text,
  stripe_customer_id text,
  subscription_status text default 'inactive', -- 'active', 'inactive', 'past_due'
  protein_target integer default 0,
  carbs_target integer default 0,
  fat_target integer default 0,
  calories_target integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

create policy "Users can view their own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id);

-- Create a table for weight logs
create table public.weight_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  weight numeric(5, 2) not null, -- in lbs
  logged_date date not null default current_date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Ensure a user can only log one weight per day
alter table public.weight_logs add constraint one_weight_per_day unique (user_id, logged_date);

-- Enable RLS
alter table public.weight_logs enable row level security;
create policy "Users can CRUD their own weight logs" on public.weight_logs
  for all using (auth.uid() = user_id);

-- Create a table for workout logs/sessions
create table public.workout_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null, -- e.g. "Push Day"
  total_volume numeric(8, 2) default 0,
  prs_broken integer default 0,
  logged_date timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.workout_logs enable row level security;
create policy "Users can CRUD their own workout logs" on public.workout_logs
  for all using (auth.uid() = user_id);

-- Function to handle new user creation and auto-create a profile
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create a table for meal logs
create table public.meal_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  date date not null default current_date,
  meal_type text not null, -- 'Breakfast', 'Lunch', 'Dinner', 'Snack'
  protein integer default 0,
  carbs integer default 0,
  fat integer default 0,
  calories integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for meal_logs
alter table public.meal_logs enable row level security;
create policy "Users can CRUD their own meal logs" on public.meal_logs
  for all using (auth.uid() = user_id);

-- Alter workout_logs to include duration and exercise count
alter table public.workout_logs
  add column duration_minutes integer default 0,
  add column exercise_count integer default 0;

-- Create a table for exercise logs (individual performance tracking for PRs)
create table public.exercise_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  workout_log_id uuid references public.workout_logs(id) on delete cascade not null,
  exercise_name text not null,
  muscle_group text,
  sets_completed integer default 0,
  max_weight numeric(6, 2) default 0, -- Track heaviest set for this exercise this session
  best_reps integer default 0, -- Reps completed at max_weight
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for exercise_logs
alter table public.exercise_logs enable row level security;
create policy "Users can CRUD their own exercise logs" on public.exercise_logs
  for all using (auth.uid() = user_id);

-- Phase 35: Premium Custom Weekly Schedule
create table public.program_schedule (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  day_of_week integer not null check (day_of_week >= 0 and day_of_week <= 6),
  workout_template_id text,
  is_rest_day boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, day_of_week),
  check ((is_rest_day = true and workout_template_id is null) or (is_rest_day = false and workout_template_id is not null))
);

-- Enable RLS for program_schedule
alter table public.program_schedule enable row level security;
create policy "Users can CRUD their own program schedule" on public.program_schedule
  for all using (auth.uid() = user_id);

-- Phase 73: Custom Workout Overrides JSONB
alter table public.profiles
  add column if not exists custom_workout_overrides jsonb default '{}'::jsonb;

-- Phase 84: Custom Exercises JSONB
alter table public.profiles
  add column if not exists custom_exercises jsonb default '[]'::jsonb;

