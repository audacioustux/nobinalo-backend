const config: {
  MIN_PASS_LENGTH: number;
  MIN_HANDLE_LENGTH: number;
  MAX_HANDLE_LENGTH: number;
  HandleRegex: RegExp;
} = {
  MIN_PASS_LENGTH: 8,
  MIN_HANDLE_LENGTH: 3,
  MAX_HANDLE_LENGTH: 40,
  HandleRegex: /^(?![_.])(?!.*[_.]{2})(?=.*[a-z])[a-z0-9._]+(?<![_.])$/,
  // # (?![_.]) = no _ or . at the beginning
  // # (?!.*[_.]{2}) = no __ or _. or ._ or .. inside
  // # (?=.*[a-z]) = at least one alphabet
  // # [a-z0-9._] = allowed characters
  // # (?<![_.]) = no _ or . at the end
  // # TODO: structured error massage
};

export default config;
