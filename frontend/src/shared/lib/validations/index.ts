/**
 * Shared Validation Library
 *
 * Export tất cả validators và messages để sử dụng trong toàn bộ ứng dụng.
 * Import từ "@/shared/lib/validations" thay vì import trực tiếp các file con.
 */

// Messages
export { ValidationMessages } from "./messages";

// Patterns & Constraints
export { CONSTRAINTS, PATTERNS } from "./primitives";

// Atomic Validators
export {
    colorHexOptional,
    colorHexWithDefault, dateOfBirthOptional, dateOfBirthOptionalNonNull, emailOptional, emailRequired, fullNameOptional, fullNameRequired, passwordRequired, phoneVNOptional, phoneVNRequired
} from "./primitives";

// Composite Schemas
export { contactInfoSchema, contactInfoSchemaCamel } from "./primitives";
