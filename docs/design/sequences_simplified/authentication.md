# Sequence Diagram: Authentication (Simplified)

---

### 3.1. Register Account (A1.1)

```mermaid
sequenceDiagram
    autonumber
    actor User as Customer
    participant FE as Frontend
    participant Auth as Supabase Auth
    participant BE as Backend
    participant DB as Database

    User->>FE: Input registration data
    activate FE
    FE->>Auth: signUp(email, password)
    activate Auth
    Auth-->>FE: Response (Pending confirmation)
    deactivate Auth

    FE->>BE: createCustomerProfile()
    activate BE
    critical Database Transaction
        BE->>DB: INSERT INTO customers
        activate DB
        DB-->>BE: Success
        deactivate DB
    end
    BE-->>FE: Profile created
    deactivate BE

    FE-->>User: Show "Check Email" notification
    deactivate FE
```

---

### 3.2. Login (A1.2)

```mermaid
sequenceDiagram
    autonumber
    actor User as User (All roles)
    participant FE as Frontend
    participant Auth as Supabase Auth

    User->>FE: Input credentials (Email/Pass)
    activate FE
    FE->>Auth: signInWithPassword()
    activate Auth

    alt Valid Credentials
        Auth-->>FE: Session (JWT)
        FE-->>User: Redirect to Dashboard
    else Invalid Credentials
        Auth-->>FE: Error (Unauthorized)
        deactivate Auth
        FE-->>User: Show error message
    end
    deactivate FE
```

---

### 3.3. Password Recovery (A1.3)

```mermaid
sequenceDiagram
    autonumber
    actor User as User
    participant FE as Frontend
    participant Auth as Supabase Auth

    User->>FE: Request password reset
    activate FE
    FE->>Auth: resetPasswordForEmail()
    activate Auth
    Auth-->>FE: OK (Email sent)
    deactivate Auth
    FE-->>User: Notify check email

    User->>FE: Input new password (from link)
    FE->>Auth: updatePassword()
    activate Auth
    Auth-->>FE: Password updated
    deactivate Auth
    FE-->>User: Notify success
    deactivate FE
```

---

### 3.4. Update Profile (A1.4)

```mermaid
sequenceDiagram
    autonumber
    actor User as User
    participant FE as Frontend
    participant BE as Backend
    participant DB as Database

    User->>FE: Change profile information
    activate FE
    FE->>BE: updateProfile(data)
    activate BE
    BE->>DB: UPDATE users SET ... WHERE id = ?
    activate DB
    DB-->>BE: Updated User
    deactivate DB
    BE-->>FE: Success
    deactivate BE
    FE-->>User: Show updated info
    deactivate FE
```

---

### 3.5. Logout (A1.5)

```mermaid
sequenceDiagram
    autonumber
    actor User as User
    participant FE as Frontend
    participant Auth as Supabase Auth

    User->>FE: Action: Logout
    activate FE
    FE->>Auth: signOut()
    activate Auth
    Auth-->>FE: OK
    deactivate Auth
    FE-->>User: Redirect to Login/Home
    deactivate FE
```
