from enum import StrEnum

class UserRole(StrEnum):
    ADMIN = "admin"
    MANAGER = "manager"
    RECEPTIONIST = "receptionist"
    TECHNICIAN = "technician"
    CUSTOMER = "customer"
