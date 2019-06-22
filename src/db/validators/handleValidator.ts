import { isLength } from 'validator';
import config from '../../config';

const { MIN_HANDLE_LENGTH, MAX_HANDLE_LENGTH, HandleRegex } = config;

export default (handle: string): TrueResult => {
  return isLength(handle, MIN_HANDLE_LENGTH, MAX_HANDLE_LENGTH)
    ? HandleRegex.test(handle)
      ? true
      : { err: `regex mismatch: ${HandleRegex.toString()}` }
    : { err: `length must be between ${MIN_HANDLE_LENGTH} to ${MAX_HANDLE_LENGTH}` };
};
