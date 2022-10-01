import { Readable, Stream } from 'node:stream';

/**
 * Get the normalized path to the file which gives equal paths regardless of the operating
 * system.
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
  const segments = path.split(/[/\\]+/);
  if (stripTrailing !== false && segments[segments.length - 1] === '')
    segments.pop();
  return prefix + segments.join('/');
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
