from enum import StrEnum

class UserRole(StrEnum):
    ADMIN = "admin"
    MANAGER = "manager" # Legacy support
    RECEPTIONIST = "receptionist"
    TECHNICIAN = "technician"
    CUSTOMER = "customer"
