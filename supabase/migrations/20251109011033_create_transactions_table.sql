/*
  # Create transactions table for café waiter app

  1. New Tables
    - `transactions`
      - `id` (uuid, primary key) - Unique transaction identifier
      - `customer_name` (text, required) - Name of the customer
      - `amount` (decimal, required) - Order amount
      - `tip` (decimal, optional, default 0) - Tip amount
      - `is_paid` (boolean, required, default true) - Payment status (true = Paid, false = Unpaid/Credit)
      - `transaction_date` (date, required, default today) - Date of transaction
      - `created_at` (timestamptz, default now) - Record creation timestamp

  2. Indexes
    - Index on `customer_name` for fast customer search
    - Index on `transaction_date` for daily queries
    - Index on `is_paid` for filtering paid/unpaid transactions

  3. Security
    - Enable RLS on `transactions` table
    - Add policy to allow anyone to read, insert, update, and delete (no auth required for this simple app)

  4. Important Notes
    - This app is designed for single-user/café use without authentication
    - All users can access all data (suitable for the use case)
    - Data is stored in Supabase for cloud sync and persistence
*/

CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  amount decimal(10,2) NOT NULL CHECK (amount >= 0),
  tip decimal(10,2) DEFAULT 0 CHECK (tip >= 0),
  is_paid boolean NOT NULL DEFAULT true,
  transaction_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_transactions_customer_name ON transactions(customer_name);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_transactions_is_paid ON transactions(is_paid);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations for everyone"
  ON transactions
  FOR ALL
  USING (true)
  WITH CHECK (true);