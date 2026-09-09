# Equipment Borrowing and Return Monitoring System

An online system for recording College equipment, borrowing transactions, returns, availability, and overdue items.

## Technology

- HTML, CSS, JavaScript
- Supabase Authentication and PostgreSQL
- GitHub Pages

## Setup

1. Create a Supabase project.
2. Run `supabase-setup.sql` in the Supabase SQL Editor.
3. Create one Email/Password user in Supabase Authentication.
4. Copy the Project URL and anon public key into `js/supabase.js`.
5. Open `index.html` through a local server or deploy it to GitHub Pages.

## Features

- Authenticated login and logout
- Dashboard summary
- Equipment CRUD with asset-code uniqueness
- Borrowing and return workflow
- Overdue detection
- Search and filtering

## Project Links

- Repository: https://github.com/jhonericgrenade-bot/SAD-EquipmentBorrowing-Granada
- Live System: https://jhonericgrenade-bot.github.io/SAD-EquipmentBorrowing-Granada/

## Test Checklist

| Test ID | Scenario | Expected Result | Result |
| --- | --- | --- | --- |
| TC-01 | Valid login | Dashboard appears | PASS / FAIL |
| TC-02 | Add equipment | Record saves | PASS / FAIL |
| TC-03 | Edit equipment | Changes appear | PASS / FAIL |
| TC-04 | Delete equipment | Confirmation appears | PASS / FAIL |
| TC-05 | Borrow available equipment | Transaction saves; equipment is Borrowed | PASS / FAIL |
| TC-06 | Return equipment | Transaction Returned; equipment Available | PASS / FAIL |
| TC-07 | Late borrowing | Transaction is Overdue | PASS / FAIL |
| TC-08 | Search borrower | Matching transaction appears | PASS / FAIL |
| TC-09 | Filter Borrowed | Borrowed transactions only | PASS / FAIL |
| TC-10 | Open GitHub Pages URL | System is online | PASS / FAIL |
