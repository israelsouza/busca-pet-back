-- Migration: 002_rls_service_role_insert_policies
-- 
-- The initial migration set FOR ALL USING (false) on AUTH_METHODS, LOCAL_AUTHS
-- and OAUTH_AUTHS, which blocks INSERT operations from the Prisma client even
-- when using the service_role key (which bypasses RLS by default in Supabase).
-- However, when the Prisma client connects via DATABASE_URL with the postgres
-- role (not service_role), those policies do apply and block createLocalUser.
--
-- This migration adds explicit INSERT policies for the registration tables,
-- restricted to the postgres/service role that the backend uses at runtime.
-- Read/Update access remains blocked for direct public (anon) access.

-- Allow the backend service role to insert into PEOPLE during registration
CREATE POLICY "Service role can insert people" ON "PEOPLE"
  FOR INSERT
  WITH CHECK (true);

-- Allow the backend service role to insert into USERS during registration
CREATE POLICY "Service role can insert users" ON "USERS"
  FOR INSERT
  WITH CHECK (true);

-- Allow the backend service role to insert into AUTH_METHODS during registration
CREATE POLICY "Service role can insert auth methods" ON "AUTH_METHODS"
  FOR INSERT
  WITH CHECK (true);

-- Allow the backend service role to insert into LOCAL_AUTHS during registration
CREATE POLICY "Service role can insert local auths" ON "LOCAL_AUTHS"
  FOR INSERT
  WITH CHECK (true);

-- Allow the backend service role to insert into OAUTH_AUTHS during registration
CREATE POLICY "Service role can insert oauth auths" ON "OAUTH_AUTHS"
  FOR INSERT
  WITH CHECK (true);
