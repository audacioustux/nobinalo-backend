async function randLength(params) {
  const buf = await crypto.randomBytes(4);
  const hex = buf.toString('hex');
  const myInt32 = parseInt(hex, 16);
  return myInt32.toString().substring(1, 7);
}
