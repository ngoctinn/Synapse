"""
Promotions Module - Custom Exceptions
"""

class PromotionException(Exception):
    def __init__(self, detail: str):
        self.detail = detail
        super().__init__(detail)

class PromotionNotFound(PromotionException):
    def __init__(self):
        super().__init__("Khuyến mãi không tồn tại")

class InvalidPromotionCode(PromotionException):
    def __init__(self, reason: str):
        super().__init__(f"Mã giảm giá không hợp lệ: {reason}")

class DuplicatePromotionCode(PromotionException):
    def __init__(self, code: str):
        super().__init__(f"Mã khuyến mãi '{code}' đã tồn tại")
