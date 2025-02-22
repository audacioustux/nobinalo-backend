import { isLength } from 'validator';
import { HandleRegex, MAX_HANDLE_LENGTH, MIN_HANDLE_LENGTH } from './_constants';
import reservedWords from '../../staticData/reservedWords.json';
import binarySearch from '../../utils/binarySearch';

const bodyValidator = (handle: string): boolean => HandleRegex.test(handle);

const lengthValidator = (handle: string): boolean =>
    isLength(handle, MIN_HANDLE_LENGTH, MAX_HANDLE_LENGTH);

const handleValidator = (handle: string): boolean =>
    bodyValidator(handle) && lengthValidator(handle);

const reservedHandles = reservedWords.filter((word): boolean => handleValidator(word)).sort();

const isReservedHandle = (handle: string): boolean => binarySearch(reservedHandles, handle);

export default (handle: string): boolean => handleValidator(handle) && !isReservedHandle(handle);

export { handleValidator, isReservedHandle };
