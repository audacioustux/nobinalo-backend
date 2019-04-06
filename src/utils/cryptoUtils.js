import crypto from 'crypto';

async function getRandomNumber() {
  const buf = await crypto.randomBytes(4);
  const hex = buf.toString('hex');
  const myInt32 = parseInt(hex, 16);
  return myInt32.toString().substring(1, 7);
}

async function getRandomString(len, allowedChar) {
  for (let i = 0; i < len; i++) {
    crypto.get;
    console.log(array[i]);
  }
}

export {
  getRandomNumber,
  getRandomString,
};
