# File này đã bị loại bỏ (deprecated) trong quá trình refactor Common Layer.
# Logic xác thực JWT đã chuyển sang src/common/auth_core.py
# Logic lấy User hiện tại đã chuyển sang src/modules/users/dependencies.py
# Vui lòng không sử dụng file này.

def get_current_user():
    raise NotImplementedError("Hàm này đã được di chuyển sang src.modules.users.dependencies")
