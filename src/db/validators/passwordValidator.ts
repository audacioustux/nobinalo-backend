import { isLength, isNumeric } from 'validator';
import { MIN_PASS_LENGTH } from './_constants';
import commonPasswords from '../../staticData/commonPasswords.json';
import binarySearch from '../../helpers/binarySearch';


const passwordValidator = (rawPassword: string): boolean => isLength(
    rawPassword, MIN_PASS_LENGTH, 250,
) && !isNumeric(rawPassword);

export const validCommonPasswords = commonPasswords
    .filter((pass): boolean => passwordValidator(pass))
    .sort();

export const isCommonPassword = (rawPassword: string): boolean => binarySearch(
    validCommonPasswords, rawPassword,
);

export default (rawPassword: string): boolean => passwordValidator(
    rawPassword,
) && !isCommonPassword(rawPassword);
