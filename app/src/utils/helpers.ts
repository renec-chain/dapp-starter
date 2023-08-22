export const isArray32 = (value: any) => {
  if (Array.isArray(value) && value.length === 32) {
      return true;
  }
  return false;
}

export const bytes32ToString = (bytes32Array: number[]): string => {
  const bytes32 = new Uint8Array(32);
  bytes32Array.forEach((byte, index) => {
    bytes32[index] = byte;
  });

  const decoder = new TextDecoder();
  const decodedString = decoder.decode(bytes32);

  // Remove null characters from the decoded string
  const nullTerminatorIndex = decodedString.indexOf('\0');
  if (nullTerminatorIndex !== -1) {
    return decodedString.substring(0, nullTerminatorIndex);
  }

  return decodedString;
};
