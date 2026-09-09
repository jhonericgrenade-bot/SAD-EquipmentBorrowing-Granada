# SAD Diagrams

## Use Case Diagram Content

Actor: **System User / Equipment Custodian**

Use cases: Login, View Dashboard, Add Equipment, View Equipment, Edit Equipment, Delete Equipment, Search Equipment, Record Borrowing, View Transactions, Return Equipment, Search Transactions, Filter Transactions, and Logout.

Draw one actor on the left in draw.io, then connect it to every use case above inside a rectangle named **Equipment Borrowing and Return Monitoring System**.

## ERD Content

```text
EQUIPMENT (1) --------------------< (M) BORROW_TRANSACTIONS
id (PK)                                 id (PK)
equipment_name                          equipment_id (FK)
category                                borrower_name
asset_code                              borrower_type
condition                               department
availability                            date_borrowed
created_at                              due_date
                                        date_returned
                                        status
                                        user_id
                                        created_at
```

Relationship explanation: One equipment item may be borrowed many times over its lifetime. Each borrowing transaction belongs to exactly one equipment item through `equipment_id`.
