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
    if (Array.isArray(opts.bin) && opts.watch)
      return Promise.reject(
        `Running watch mode with multiple binary targets is not yet supported`
      );
    const binTargets = opts.bin
      ? Array.isArray(opts.bin)
        ? opts.bin
        : [opts.bin]
      : [ctx.projectName];
    for (const binTarget of binTargets) {
      opts.bin = binTarget;
      const args = parseCargoArgs(opts, ctx, binTarget);
      let finalCommand = [...targetCommand, ...args];
      if (opts.watch) finalCommand = wrapWithCargoWatch(finalCommand);
      await runCargo(finalCommand, ctx);
    }
    return Promise.resolve({ success: true });
  } catch (err) {
    return Promise.reject(err.message);
  }
}
