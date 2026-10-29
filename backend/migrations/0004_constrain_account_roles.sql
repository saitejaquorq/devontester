-- Admin/staff role separation (US-003). Additive and backward compatible:
-- backfills any existing value that is not already 'admin' or 'staff' (e.g.
-- the original 'receptionist' default) to 'staff', then constrains the
-- column to those two values going forward.

UPDATE accounts SET role = 'staff' WHERE role NOT IN ('admin', 'staff');

ALTER TABLE accounts ALTER COLUMN role SET DEFAULT 'staff';

ALTER TABLE accounts
    ADD CONSTRAINT IF NOT EXISTS accounts_role_check CHECK (role IN ('admin', 'staff'));
