# Sequence Diagram: Customer Module (Simplified)

---

### 3.1. Browse Services & Details (A2.1, A2.2)

```mermaid
sequenceDiagram
    autonumber
    actor KH as Customer
    participant FE as Frontend
    participant BE as Backend
    participant DB as Database

    KH->>FE: View Service List / Detail
    activate FE
    FE->>BE: fetchServices()
    activate BE
    BE->>DB: SELECT * FROM services
    activate DB
    DB-->>BE: Service Data
    deactivate DB
    BE-->>FE: Response Data
    deactivate BE
    FE-->>KH: Display information
    deactivate FE
```

---

### 3.2. Intelligent Slot Searching (A2.4)

```mermaid
sequenceDiagram
    autonumber
    actor KH as Customer
    participant FE as Frontend
    participant BE as Backend
    participant DB as Database

    KH->>FE: Select Service & Date
    activate FE
    FE->>BE: getAvailableSlots()
    activate BE

    BE->>DB: queryResourceData()
    activate DB
    DB-->>BE: Staff/Room/Booking Data
    deactivate DB

    Note right of BE: SISF Algorithm (RCPSP & Jain's Fairness Index)

    BE-->>FE: Optimized Slots List
    deactivate BE
    FE-->>KH: Display available slots
    deactivate FE
```

---

### 3.3. Create Booking (A2.5)

```mermaid
sequenceDiagram
    autonumber
    actor KH as Customer
    participant FE as Frontend
    participant BE as Backend
    participant DB as Database

    KH->>FE: Confirm Booking
    activate FE
    FE->>BE: createBooking(data)
    activate BE

    critical Atomic Transaction
        BE->>DB: Exclusion Constraint Check
        BE->>DB: INSERT INTO bookings
        activate DB
        DB-->>BE: Booking Created
        deactivate DB
    end

    Note right of BE: Trigger Notification Logic (Email/App)

    BE-->>FE: Booking ID & Status
    deactivate BE
    FE-->>KH: Show success message
    deactivate FE
```

---

### 3.4. Join Waitlist (A2.6)

```mermaid
sequenceDiagram
    autonumber
    actor KH as Customer
    participant FE as Frontend
    participant BE as Backend
    participant DB as Database

    KH->>FE: Join Waitlist for full slot
    activate FE
    FE->>BE: joinWaitlist()
    activate BE
    BE->>DB: INSERT INTO waitlist_entries
    activate DB
    DB-->>BE: Success
    deactivate DB
    BE-->>FE: Confirmed
    deactivate BE
    FE-->>KH: Notify registration success
    deactivate FE
```

---

### 3.5. Live Chat Support (A2.7)

```mermaid
sequenceDiagram
    autonumber
    actor KH as Customer
    participant FE as Frontend
    participant BE as Backend
    participant DB as Database

    KH->>FE: Send support message
    activate FE
    FE->>BE: sendMessage()
    activate BE

    BE->>DB: INSERT INTO chat_messages
    Note right of DB: Protected by RLS Policy (auth.uid())

    BE-->>FE: Status: Sent
    deactivate BE
    FE-->>KH: Wait for receptionist response
    deactivate FE
```

---

### 3.6. View History & Request Cancellation (A3.1, A3.2)

```mermaid
sequenceDiagram
    autonumber
    actor KH as Customer
    participant FE as Frontend
    participant BE as Backend
    participant DB as Database

    KH->>FE: View History / Cancel Booking
    activate FE
    FE->>BE: requestAction()
    activate BE

    alt Action: Cancellation
        BE->>BE: validatePolicy(TimeLimit)
        BE->>DB: UPDATE booking_status = 'CANCELLED'
        activate DB
        DB-->>BE: Success
        deactivate DB
    else Action: View
        BE->>DB: SELECT * FROM bookings WHERE customer_id = ?
    end

    BE-->>FE: Response result
    deactivate BE
    FE-->>KH: Update UI
    deactivate FE
```

---

### 3.7. Receive Reminder Notification (A3.3)

```mermaid
sequenceDiagram
    autonumber
    participant BE as Backend
    participant DB as Database
    actor KH as Customer

    Note left of BE: Scheduled Task (Cron)
    BE->>DB: findUpcomingBookings()
    DB-->>BE: Remind List

    BE->>KH: Push Notification (Email/SMS/App)

    KH-->>BE: Response: Confirm / Cancel
    BE->>DB: Update confirmed status
```

---

### 3.8. Warranty Request (A3.6)

```mermaid
sequenceDiagram
    autonumber
    actor KH as Customer
    participant FE as Frontend
    participant BE as Backend
    participant DB as Database

    KH->>FE: Submit warranty info
    activate FE
    FE->>BE: createWarrantyRequest()
    activate BE

    BE->>DB: INSERT INTO warranty_tickets
    activate DB
    DB-->>BE: Ticket Created
    deactivate DB

    BE-->>FE: Success
    deactivate BE
    FE-->>KH: Show "Pending" status
    deactivate FE
```
