const sliceIntoChunks = (arr: any[], chunkSize: number): [][] => {
  const res = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    if (chunk.length === chunkSize) {
      res.push(chunk);
    }
  }
  return res;
};

export default sliceIntoChunks;
