class ServiceError(Exception):
    """Base exception for services module."""
    pass

class ServiceNotFoundError(ServiceError):
    pass

class SkillNotFoundError(ServiceError):
    pass

class SkillAlreadyExistsError(ServiceError):
    pass
