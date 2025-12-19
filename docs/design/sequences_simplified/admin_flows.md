# Sequence Diagram: Administrator Module (Simplified)

---

### 3.1. Staff Shift Management & Scheduling (C4)

```mermaid
sequenceDiagram
    autonumber
    actor Admin as Administrator
    participant FE as Frontend
    participant BE as Backend
    participant DB as Database

    Admin->>FE: Select staff & Assign shift
    activate FE
    FE->>BE: assignStaffShift(data)
    activate BE

    BE->>BE: checkScheduleConstraints()
    Note right of BE: Solver checks for existing booking overlaps

    alt Valid Schedule
        BE->>DB: INSERT INTO staff_schedules
        activate DB
        DB-->>BE: Success
        deactivate DB
        BE-->>FE: Confirmed
        FE-->>Admin: Show updated schedule
    else Schedule Conflict
        BE-->>FE: Error (Shift Overlap)
        FE-->>Admin: Show conflict warning
    end
    deactivate BE
    deactivate FE
```

---

### 3.2. Service Catalog Management (C5)

```mermaid
sequenceDiagram
    autonumber
    actor Admin as Administrator
    participant FE as Frontend
    participant BE as Backend
    participant DB as Database

    Admin->>FE: Input New Service Data
    activate FE
    FE->>BE: createService(payload)
    activate BE

    BE->>DB: INSERT INTO services
    activate DB
    DB-->>BE: Service Record
    deactivate DB

    BE-->>FE: Success response
    deactivate BE
    FE-->>Admin: Update catalog view
    deactivate FE
```

---

### 3.3. Resource & Maintenance Management (C7)

```mermaid
sequenceDiagram
    autonumber
    actor Admin as Administrator
    participant FE as Frontend
    participant BE as Backend
    participant DB as Database

    Admin->>FE: Update Resource Status (Room/Bed)
    activate FE
    FE->>BE: updateResourceStatus()
    activate BE

    alt Maintenance Mode
        BE->>DB: UPDATE resources SET status = 'MAINTENANCE'
        Note right of BE: System auto-excludes from future booking slots
    else Soft Delete
        BE->>DB: UPDATE resources SET is_active = false
    end

    activate DB
    DB-->>BE: DB Record Updated
    deactivate DB
    BE-->>FE: Confirmed
    deactivate BE
    FE-->>Admin: Show new resource status
    deactivate FE
```

---

### 3.4. Treatment Package Configuration (Punch Card) (C6)

```mermaid
sequenceDiagram
    autonumber
    actor Admin as Administrator
    participant FE as Frontend
    participant BE as Backend
    participant DB as Database

    Admin->>FE: Create New Treatment Package
    activate FE
    FE->>BE: createPackage(rules)
    activate BE

    BE->>DB: INSERT INTO treatment_packages
    activate DB
    DB-->>BE: Package Created
    deactivate DB

    BE-->>FE: Success
    deactivate BE
    FE-->>Admin: Show new package list
    deactivate FE
```

---

### 3.5. Promotion & Voucher Campaign (C8)

```mermaid
sequenceDiagram
    autonumber
    actor Admin as Administrator
    participant FE as Frontend
    participant BE as Backend
    participant DB as Database

    Admin->>FE: Set up promo code/deadline
    activate FE
    FE->>BE: activatePromotion()
    activate BE

    BE->>DB: INSERT INTO promotions
    activate DB
    DB-->>BE: Promo Campaign Active
    deactivate DB

    BE-->>FE: Confirmed
    deactivate BE
    FE-->>Admin: Show campaign details
    deactivate FE
```
