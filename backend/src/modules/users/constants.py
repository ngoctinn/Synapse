from enum import StrEnum

class UserRole(StrEnum):
    MANAGER = "manager"
    RECEPTIONIST = "receptionist"
    TECHNICIAN = "technician"
    CUSTOMER = "customer"
