# Sequence Diagram: Receptionist Module (Simplified)

---

### 3.1. Dashboard & Customer Profile (B1.1, B1.2)

```mermaid
sequenceDiagram
    autonumber
    actor LT as Receptionist
    participant FE as Frontend
    participant BE as Backend
    participant DB as Database

    LT->>FE: View Overview / Search Customer
    activate FE
    FE->>BE: fetchDashboardData()
    activate BE
    BE->>DB: SELECT * FROM bookings / customers
    activate DB
    DB-->>BE: Results
    deactivate DB
    BE-->>FE: Response Data
    deactivate BE

    alt Create New Customer
        LT->>FE: Input New Customer Info
        FE->>BE: createCustomer()
        activate BE
        BE->>DB: INSERT INTO customers
        BE-->>FE: Profile Created
        deactivate BE
    end

    FE-->>LT: Display result
    deactivate FE
```

---

### 3.2. Manual Booking at Front Desk (B1.3)

```mermaid
sequenceDiagram
    autonumber
    actor LT as Receptionist
    participant FE as Frontend
    participant BE as Backend
    participant DB as Database

    LT->>FE: Input Booking Details
    activate FE
    FE->>BE: checkAvailability()
    activate BE
    Note right of BE: Backend validates resource constraints (SISF)
    BE-->>FE: Slot Available

    LT->>FE: Confirm Manual Booking
    FE->>BE: createManualBooking()
    activate BE

    critical DB Transaction
        BE->>DB: INSERT INTO bookings
        activate DB
        DB-->>BE: Success
        deactivate DB
    end

    BE-->>FE: Update Overview Dashboard
    deactivate BE
    FE-->>LT: Display new appointment
    deactivate FE
```

---

### 3.3. Customer Check-in & Treatment Deduction (B1.4)

```mermaid
sequenceDiagram
    autonumber
    actor LT as Receptionist
    participant FE as Frontend
    participant BE as Backend
    participant DB as Database

    LT->>FE: Click "Check-in"
    activate FE
    FE->>BE: confirmArrival()
    activate BE

    critical Atomic Sync
        BE->>DB: UPDATE booking_status = 'IN_PROGRESS'
        Note right of DB: Automatically deduct session if linked to treatment card
        BE->>DB: UPDATE customer_treatments SET used_sessions += 1
        activate DB
        DB-->>BE: Updated
        deactivate DB
    end

    BE-->>FE: OK
    deactivate BE
    FE-->>LT: Show status "Serving"
    deactivate FE
```

---

### 3.4. Payment Processing & Billing (B1.5)

```mermaid
sequenceDiagram
    autonumber
    actor LT as Receptionist
    participant FE as Frontend
    participant BE as Backend
    participant DB as Database

    LT->>FE: Confirm Payment
    activate FE
    FE->>BE: processPayment()
    activate BE

    critical Billing Transaction
        BE->>DB: INSERT INTO invoices
        BE->>DB: UPDATE booking_status = 'COMPLETED'
        activate DB
        DB-->>BE: Invoice Data
        deactivate DB
    end

    BE-->>FE: Return E-Invoice
    deactivate BE
    FE-->>LT: Show Print Preview & Finish
    deactivate FE
```

---

### 3.5. Treatment Progress Tracking (B1.7)

```mermaid
sequenceDiagram
    autonumber
    actor LT as Receptionist
    participant FE as Frontend
    participant BE as Backend
    participant DB as Database

    LT->>FE: Query Customer Treatment
    activate FE
    FE->>BE: getCustomerTreatments()
    activate BE
    BE->>DB: SELECT * FROM customer_treatments WHERE customer_id = ?
    activate DB
    DB-->>BE: Progress Data (remaining sessions, history)
    deactivate DB
    BE-->>FE: Response
    deactivate BE
    FE-->>LT: Display info
    deactivate FE
```

---

### 3.6. Auto Reschedule on Conflict (B1.8)

```mermaid
sequenceDiagram
    autonumber
    actor Admin as Administrator
    participant FE as Frontend
    participant BE as Backend
    participant DB as Database

    Admin->>FE: Update Staff Schedule (Unavailable)
    activate FE
    FE->>BE: updateSchedule()
    activate BE

    BE->>DB: findConflictingBookings()
    activate DB
    DB-->>BE: Conflict List
    deactivate DB

    loop Process Conflicts
        BE->>BE: findAlternativeOption()
        alt Option Found
            BE->>DB: UPDATE booking (staff_id/time)
            Note right of BE: Send reschedule notification to customer
        else Critical Conflict
            BE->>BE: markForManualAction()
            Note right of BE: Notify receptionist for manual fix
        end
    end

    BE-->>FE: Reschedule Summary Report
    deactivate BE
    FE-->>Admin: Show auto-fix report
    deactivate FE
```
