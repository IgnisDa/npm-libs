import { Readable, Stream } from 'node:stream';

/**
 * Get the normalized path to the file which gives equal paths regarless of the
 * operating systems.
 */
export const normalizePath = (path: string, stripTrailing = false) => {
  if (path === '\\' || path === '/') return '/';

  const len = path.length;
  if (len <= 1) return path;

  let prefix = '';
  if (len > 4 && path[3] === '\\') {
    const ch = path[2];
    if ((ch === '?' || ch === '.') && path.slice(0, 2) === '\\\\') {
      path = path.slice(2);
      prefix = '//';
    }
  }

  const segs = path.split(/[/\\]+/);
  if (stripTrailing !== false && segs[segs.length - 1] === '') 
    segs.pop();
  return prefix + segs.join('/');
};

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
