class TreatmentException(Exception):
    """Base exception for Treatment module."""
    def __init__(self, message: str):
        self.message = message
        super().__init__(self.message)

class TreatmentNotFound(TreatmentException):
    def __init__(self, detail: str = "Liệu trình không tồn tại."):
        self.detail = detail
        super().__init__(self.detail)

class TreatmentExpired(TreatmentException):
    def __init__(self, detail: str = "Liệu trình đã hết hạn."):
        self.detail = detail
        super().__init__(self.detail)

class TreatmentOutOfSessions(TreatmentException):
    def __init__(self, detail: str = "Liệu trình đã hết số buổi."):
        self.detail = detail
        super().__init__(self.detail)
