class UserException(Exception):
    """Base exception for Users module"""
    pass

class UserNotFound(UserException):
    def __init__(self, detail: str = "Người dùng không tồn tại"):
        self.detail = detail

class UserAlreadyExists(UserException):
    def __init__(self, detail: str = "Người dùng đã tồn tại"):
        self.detail = detail

class UserOperationError(UserException):
    def __init__(self, detail: str):
        self.detail = detail
