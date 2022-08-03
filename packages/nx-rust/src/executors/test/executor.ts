import { ExecutorContext } from '@nrwl/devkit';

import { parseCargoArgs, runCargo } from '../../common';
import CLIOptions from './schema';

export default async function (opts: CLIOptions, ctx: ExecutorContext) {
  try {
    let args = parseCargoArgs(opts, ctx);
    if (opts.watch) {
      args.unshift('cargo');
      const oldArgs = args.join(' ');
      args = ['watch', '-cq', '-s', `"${oldArgs}"`];
    }
    await runCargo(args, ctx);
    return { success: true };
  } catch (err) {
    return {
      success: false,
      reason: err?.message,
    };
  }
}
