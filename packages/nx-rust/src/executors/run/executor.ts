import {
  getCargoCommandFromExecutor,
  parseCargoArgs,
  runCargo,
  wrapWithCargoWatch,
} from '../../common';

import type { ExecutorContext } from '@nrwl/devkit';

import type CLIOptions from './schema';

export default async function (opts: CLIOptions, ctx: ExecutorContext) {
  const targetCommand = getCargoCommandFromExecutor(ctx.target.executor);
  try {
    if (!opts.bin) opts.bin = ctx.projectName;
    const args = parseCargoArgs(opts, ctx, opts.bin);
    let finalCommand = [...targetCommand, ...args];
    if (opts.watch) finalCommand = wrapWithCargoWatch(finalCommand);
    await runCargo(finalCommand, ctx);
    return Promise.resolve({ success: true });
  } catch (err) {
    return Promise.resolve(err?.message);
  }
}
