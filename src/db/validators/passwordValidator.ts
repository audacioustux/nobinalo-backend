const commonPassList = allCommonPassList
  .filter(element => element.length >= MIN_PASS_LENGTH && !isNumeric(element))
  .sort();
