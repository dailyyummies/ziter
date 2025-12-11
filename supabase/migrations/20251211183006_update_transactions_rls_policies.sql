/*
  # Update RLS Policies for Transactions Table

  1. Changes
    - Remove the existing "Allow all operations for everyone" policy
    - Add separate policies for SELECT, INSERT, UPDATE, and DELETE operations
    - Each policy explicitly grants public access for this single-user waiter app
  
  2. Security
    - RLS remains enabled on the transactions table
    - Policies are separated by operation type for better maintainability
    - Public access is granted since this is a single-waiter application without authentication
  
  Note: This app is designed for a single waiter without user authentication.
  If multi-user support is needed in the future, these policies should be updated
  to check authentication and ownership.
*/

-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Allow all operations for everyone" ON transactions;

-- Create separate policies for each operation type
CREATE POLICY "Allow public to view transactions"
  ON transactions
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public to insert transactions"
  ON transactions
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public to update transactions"
  ON transactions
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public to delete transactions"
  ON transactions
  FOR DELETE
  TO public
  USING (true);
