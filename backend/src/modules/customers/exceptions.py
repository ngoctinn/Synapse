class CustomerException(Exception):
    def __init__(self, detail: str):
        self.detail = detail

class CustomerNotFound(CustomerException):
    pass

class CustomerAlreadyExists(CustomerException):
    pass
