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
    const args = parseCargoArgs(opts, ctx);
    let finalCommand = [...targetCommand, ...args];
    if (opts.watch) finalCommand = wrapWithCargoWatch(finalCommand);
    await runCargo(finalCommand, ctx);
    return { success: true };
  } catch (err) {
    return { success: false, reason: err?.message };
  }
}
