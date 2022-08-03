import { Readable, Stream } from 'node:stream';

/**
 * Extract the longest common prefix between an array of strings.
 * Ref: https://stackoverflow.com/a/68703218/11667450
 */
export const longestCommonPrefix = (words: string[]) => {
  if (!words[0] || words.length == 1) return words[0] || '';
  let i = 0;
  while (words[0][i] && words.every((w) => w[i] === words[0][i])) i++;
  return words[0].substr(0, i);
};

export const bufferToStream = (buffer: Buffer) => {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
};

export const pipelineToObject = async (pipeline: Stream) => {
  return new Promise<any>((resolve, reject) => {
    let _buf: any;
    pipeline.on('data', (chunk) => (_buf = chunk['value']));
    pipeline.on('end', () => resolve(_buf));
    pipeline.on('error', (err) => reject(`error converting stream - ${err}`));
  });
};
