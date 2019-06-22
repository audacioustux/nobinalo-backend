import reservedWords from '../../staticData/reservedWords.json';
import config from '../../config';

const { MIN_HANDLE_LENGTH, HandleRegex } = config;

const blackListedHandles = reservedWords
  .filter(element => element.length >= MIN_HANDLE_LENGTH && HandleRegex.test(element))
  .sort();
