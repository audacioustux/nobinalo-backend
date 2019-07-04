export const MIN_HANDLE_LENGTH = 3;
export const MAX_HANDLE_LENGTH = 40;
export const HandleRegex = /^(?![_.])(?!.*[_.]{2})(?=.*[a-z])[a-z0-9._]+(?<![_.])$/;
// # (?![_.]) = no _ or . at the beginning
// # (?!.*[_.]{2}) = no __ or _. or ._ or .. inside
// # (?=.*[a-z]) = at least one alphabet
// # [a-z0-9._]+ = allowed characters
// # (?<![_.]) = no _ or . at the end
// RES: for complex mismatch arr:
// /(^[_.])|([._]{2})|(^[0-9._]+$)|([^a-z0-9._]+)|([_.]$)/

export const MIN_PASS_LENGTH = 8;