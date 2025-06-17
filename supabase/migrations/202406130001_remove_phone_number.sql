-- Migration: 202406130001 – Remove phone_number column from users table

ALTER TABLE IF EXISTS users
  DROP COLUMN IF EXISTS phone_number; 