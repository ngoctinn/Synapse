class StaffException(Exception):
    """Base exception for Staff module"""
    pass

class StaffNotFound(StaffException):
    def __init__(self, detail: str = "Không tìm thấy nhân viên"):
        self.detail = detail

class StaffAlreadyExists(StaffException):
    def __init__(self, detail: str = "Nhân viên đã tồn tại"):
        self.detail = detail

class StaffOperationError(StaffException):
    def __init__(self, detail: str):
        self.detail = detail
