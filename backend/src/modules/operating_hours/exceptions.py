"""
Operating Hours Module - Custom Exceptions
"""


class OperatingHoursException(Exception):
    """Base exception cho module."""
    def __init__(self, detail: str = "Lỗi xử lý giờ hoạt động"):
        self.detail = detail
        super().__init__(self.detail)


class ExceptionDateNotFound(OperatingHoursException):
    """Không tìm thấy ngày ngoại lệ."""
    def __init__(self, exception_date_id: str | None = None):
        detail = "Không tìm thấy ngày ngoại lệ"
        if exception_date_id:
            detail = f"Không tìm thấy ngày ngoại lệ với ID: {exception_date_id}"
        super().__init__(detail)


class DuplicateExceptionDate(OperatingHoursException):
    """Ngày ngoại lệ đã tồn tại."""
    def __init__(self, date_str: str | None = None):
        detail = "Ngày ngoại lệ đã tồn tại trong hệ thống"
        if date_str:
            detail = f"Ngày {date_str} đã được thiết lập trước đó"
        super().__init__(detail)


class InvalidOperatingHours(OperatingHoursException):
    """Giờ hoạt động không hợp lệ."""
    def __init__(self, detail: str = "Giờ mở cửa phải trước giờ đóng cửa"):
        super().__init__(detail)
