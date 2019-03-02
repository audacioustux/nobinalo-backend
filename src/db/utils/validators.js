import { isLength, isNumeric } from 'validator';
import allCommonPassList from './commonPasswords.json';
import allBlackListedHandles from './blackListedHandles.json';

const MAX_PASS_LENGTH = 8;
const MIN_HANDLE_LENGTH = 3;
const MAX_HANDLE_LENGTH = 40;

const HandleRegex=/(?=.{3,}$)(?![_.])(?!.*[_.]{2})(?=.*[a-z])[a-z0-9._]+(?<![_.])$/;
    // # (?=.{3,30}$) = username is minimum 3 characters long. (max_length value used in model)
    // # (?![_.]) = no _ or . at the beginning
    // # (?!.*[_.]{2}) = no __ or _. or ._ or .. inside
    // # (?=.*[a-z]) = at least one alphabet
    // # [a-z0-9._] = allowed characters
    // # (?<![_.]) = no _ or . at the end
    // # TODO: structured error massage

const commonPassList = allCommonPassList.filter(
  element => isLength(element, {min: MIN_HANDLE_LENGTH, max: MAX_HANDLE_LENGTH}),
).sort();

const blackListedHandles = allBlackListedHandles.filter(
  element => element.length >= MAX_PASS_LENGTH && !isNumeric(element),
).sort();

function binarySearch(sortedArray, seekElement) {
  let startIndex = 0;
  let endIndex = sortedArray.length - 1;

  while (startIndex <= endIndex) {
    const middleIndex = startIndex + Math.floor((endIndex - startIndex) / 2);
    if (sortedArray[middleIndex] === seekElement) {
      return true;
    }

    if (sortedArray[middleIndex] < seekElement) {
      startIndex = middleIndex + 1;
    } else {
      endIndex = middleIndex - 1;
    }
  }
  return false;
}

function commonPass(rawPassword) {
  return binarySearch(commonPassList, rawPassword.toLowerCase());
}

function validatePassword(rawPassword) {
  if (commonPass(rawPassword)) throw new Error('Your password can\'t be a commonly used password.');
  if (!isLength(rawPassword, { min: MAX_PASS_LENGTH })) {
    throw new Error(`Your password must contain at least ${MAX_PASS_LENGTH} characters.`);
  }
  if (isNumeric(rawPassword)) throw new Error('Your password can\'t be entirely numeric.');

  return true;
}

function isBlackListedHandle(){
  
}


export {
  commonPass,
  validatePassword,
  validateHandle
};
