# Systems Analysis and Design Documentation

## Student Information

- Name: ____________________
- Section: BSIT Section B
- Course: Systems Analysis and Design
- System: Online Equipment Borrowing and Return Monitoring System

## Problem Statement

The College currently records equipment borrowing manually, making it difficult for staff to identify available equipment, borrowers, due dates, returned items, and overdue transactions. Students, faculty, staff, and equipment custodians are affected by delayed and inaccurate monitoring. The proposed Online Equipment Borrowing and Return Monitoring System stores equipment and borrowing records digitally, monitors availability, records returns, identifies overdue items, and provides a dashboard for easier tracking.

## Actors

| Actor | Role |
| --- | --- |
| System User / Equipment Custodian | Logs in and manages equipment, borrowing transactions, returns, searches, and filters. |
| Borrower | Student, faculty member, or staff member whose borrowing details are recorded. The borrower does not log in for this laboratory activity. |

## Business Rules

| ID | Rule |
| --- | --- |
| BR-01 | Equipment name is required. |
| BR-02 | Asset code must be unique. |
| BR-03 | Only available equipment can be selected for borrowing. |
| BR-04 | Borrower name is required. |
| BR-05 | Due date cannot be earlier than the borrowing date. |
| BR-06 | A new transaction receives Borrowed status. |
| BR-07 | Borrowed equipment becomes unavailable. |
| BR-08 | Returned equipment becomes available. |
| BR-09 | A non-returned transaction past its due date becomes Overdue. |
| BR-10 | Equipment deletion requires confirmation. |
| BR-11 | Only authenticated users can manage records. |
| BR-12 | A returned transaction cannot be returned again. |

## Requirements Traceability Matrix

| Requirement | Implemented Feature | Test ID |
| --- | --- | --- |
| FR-01 | Email and password login with Supabase Authentication | TC-01 |
| FR-02 | Add equipment form | TC-02 |
| FR-03 | Edit equipment button and form | TC-03 |
| FR-04 | Delete button with confirmation | TC-04 |
| FR-05 | New borrowing transaction form | TC-05 |
| FR-06 | Return button updates transaction and equipment | TC-06 |
| FR-07 | Automatic overdue detection | TC-07 |
| FR-08 | Equipment and transaction search fields | TC-08 |
| FR-09 | Availability and transaction-status filters | TC-09 |
| FR-10 | Dashboard summary cards | TC-10 |

## Functional Testing Results

| Test ID | Test Scenario | Expected Result | Actual Result | Status |
| --- | --- | --- | --- | --- |
| TC-01 | Log in using a valid account. | Dashboard is displayed. | Dashboard displayed. | PASS |
| TC-02 | Add a new equipment record. | Record is saved and displayed. | Record saved and displayed. | PASS |
| TC-03 | Edit an equipment record. | Updated details are displayed. | Updated details displayed. | PASS |
| TC-04 | Delete an equipment record. | Confirmation appears before deletion. | Confirmation displayed. | PASS |
| TC-05 | Borrow an available equipment item. | Transaction saves and equipment becomes Borrowed. | Transaction saved; availability changed. | PASS |
| TC-06 | Return a borrowed equipment item. | Transaction becomes Returned; equipment becomes Available. | Return completed; availability changed. | PASS |
| TC-07 | Open a transaction with an old due date. | Transaction displays as Overdue. | Overdue status displayed. | PASS |
| TC-08 | Search using a borrower name. | Matching transaction is displayed. | Matching record displayed. | PASS |
| TC-09 | Filter transactions by Borrowed. | Only Borrowed transactions appear. | Filter worked. | PASS |
| TC-10 | Open the GitHub Pages URL. | System is accessible online. | GitHub Pages site opened successfully. | PASS |

## Explanation for Demonstration

**Database relationship:** One equipment record can have many borrowing transactions over time. Each transaction has one `equipment_id`, which points to one equipment record.

**Supabase query:** The application uses `supabase.from('equipment').select('*').order('asset_code')` to retrieve every equipment record, then displays the result in the Equipment table.

**Return logic:** Clicking Return records today's date in `date_returned`, changes the transaction status to Returned, and changes the corresponding equipment availability to Available.

## Submission Links

- GitHub Repository: https://github.com/jhonericgrenade-bot/SAD-EquipmentBorrowing-Granada
- Live System: https://jhonericgrenade-bot.github.io/SAD-EquipmentBorrowing-Granada/
