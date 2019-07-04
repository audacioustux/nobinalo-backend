function binarySearch(sortedArray: (string | number)[], seekElement: (string | number)): boolean {
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

export default binarySearch;
