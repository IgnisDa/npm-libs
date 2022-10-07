import { ExecutorContext } from '@nrwl/devkit';

import {
  getCargoCommandFromExecutor,
  parseCargoArgs,
  runCargo,
  wrapWithCargoWatch,
} from '../../common';
import CLIOptions from './schema';

export default async function (opts: CLIOptions, ctx: ExecutorContext) {
  const targetCommand = getCargoCommandFromExecutor(ctx.target.executor);
  try {
    const args = parseCargoArgs(opts, ctx, opts.bin);
    let finalCommand = [...targetCommand, ...args];
    if (opts.watch) finalCommand = wrapWithCargoWatch(finalCommand);
    await runCargo(finalCommand, ctx);
    return Promise.resolve({ success: true });
  } catch (err) {
    return Promise.reject(err?.message);
  }
}
