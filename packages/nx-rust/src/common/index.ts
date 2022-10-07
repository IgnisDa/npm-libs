import { parse as parseToml, stringify as stringifyToml } from '@iarna/toml';
import {
  getWorkspaceLayout as nrwlGetWorkspaceLayout,
  names as nrwlNames,
} from '@nrwl/devkit';
import * as chalk from 'chalk';
import { spawn } from 'node:child_process';

import { CARGO, CARGO_TOML, WATCH } from './constants';
import {
  BinaryOptions,
  CompilationOptions,
  DisplayOptions,
  FeatureSelection,
  ManifestOptions,
  OutputOptions,
  ToolchainOptions,
} from './schema';

import type {
  ExecutorContext as NxExecutorContext,
  Tree as nrwlTree,
} from '@nrwl/devkit';

export interface GeneratorOptions {
  projectName: string;
  moduleName: string;
  projectRoot: string;
  projectDirectory: string;
  parsedTags: string[];
  edition: number;
}

export type CargoOptions = Partial<
  FeatureSelection &
    CompilationOptions &
    OutputOptions &
    DisplayOptions &
    ManifestOptions &
    ToolchainOptions &
    BinaryOptions
>;

interface GeneratorCLIOptions {
  name: string;
  directory?: string;
  tags?: string;
  edition?: number;
}

interface Names {
  name: string;
  className: string;
  propertyName: string;
  constantName: string;
  fileName: string;
  snakeName: string;
}

export function cargoNames(name: string): Names {
  const result = nrwlNames(name) as Names;
  result.snakeName = result.constantName.toLowerCase();
  return result;
}

export const normalizeGeneratorOptions = <T extends GeneratorCLIOptions>(
  projectType: 'application' | 'library',
  host: nrwlTree,
  opts: T
): T & GeneratorOptions => {
  const layout = nrwlGetWorkspaceLayout(host);
  const names = cargoNames(opts.name);
  // let fileName = names.fileName;
  const moduleName = names.snakeName;

  // Only convert project/file name casing if it's invalid
  const projectName = /^[-_a-zA-Z0-9]+$/.test(opts.name)
    ? opts.name
    : names.snakeName;

  const fileName = /^[-_a-zA-Z0-9]+$/.test(opts.name)
    ? opts.name
    : names.fileName;

  const rootDir = {
    application: layout.appsDir,
    library: layout.libsDir,
  }[projectType];

  const projectDirectory = opts.directory
    ? `${nrwlNames(opts.directory).fileName}/${fileName}`
    : fileName;

  const projectRoot = `${rootDir}/${projectDirectory}`;
  const parsedTags = opts.tags?.split(',').map((s) => s.trim()) ?? [];
  const edition = opts.edition ?? 2021;

  return {
    ...opts,
    projectName,
    moduleName,
    projectRoot,
    projectDirectory,
    parsedTags,
    edition,
  };
};

export const updateWorkspaceMembers = (
  host: nrwlTree,
  opts: GeneratorOptions
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const existingToml: any = parseToml(host.read(CARGO_TOML, 'utf-8'));
  existingToml.workspace.members.push(opts.projectRoot);
  const updated = stringifyToml(existingToml);
  host.write(CARGO_TOML, updated);
};

/* Parse cargo arguments and return the final command to be run */
export const parseCargoArgs = (
  opts: CargoOptions,
  ctx: NxExecutorContext,
  binTarget?: string
): string[] => {
  const args = [];
  if (opts.toolchain) args.push(`+${opts.toolchain}`);
  if (!ctx.projectName) throw new Error('Expected project name to be non-null');
  if (opts.bin) args.push('--bin', binTarget);
  args.push('--package');
  args.push(ctx.projectName);
  if (opts.features)
    if (opts.features === 'all') args.push('--all-features');
    else args.push('--features', opts.features);
  if (opts.noDefaultFeatures) args.push('--no-default-features');
  if (opts.target) args.push('--target', opts.target);
  if (opts.release) args.push('--release');
  if (opts.targetDir) args.push('--target-dir', opts.targetDir);
  if (opts.verbose) args.push('-v');
  if (opts.veryVerbose) args.push('-vv');
  if (opts.quiet) args.push('-q');
  if (opts.messageFormat) args.push('--message-format', opts.messageFormat);
  if (opts.locked) args.push('--locked');
  if (opts.frozen) args.push('--frozen');
  if (opts.offline) args.push('--offline');
  return args;
};

export const runCargo = (args: string[], ctx: NxExecutorContext) => {
  console.log('>', chalk.dim(`${CARGO} ${args.join(' ')}`));
  return new Promise<void>((resolve, reject) =>
    spawn(CARGO, args, {
      cwd: ctx.root,
      shell: true,
      stdio: 'inherit',
    })
      .on('error', reject)
      .on('close', (code) => {
        if (code) reject(new Error(`Cargo failed with exit code ${code}`));
        else resolve();
      })
  );
};

/**
 * Gets the cargo command to run from an executor. Eg: `@ignisda/nx-rust:nextest` =>
 * `['nextest', 'run']`, `@ignisda/nx-rust:build` => `['build']` etc.
 */
export const getCargoCommandFromExecutor = (executor: string) => {
  const target = executor.split(':').at(-1);
  const toReturn = [];
  if (target === 'build') toReturn.push('build');
  else if (target === 'test') toReturn.push('test');
  else if (target === 'clippy') toReturn.push('clippy');
  else if (target === 'run') toReturn.push('run');
  else if (target === 'nextest') toReturn.push('nextest', 'run');
  return toReturn;
};

/**
 * Takes an array of commands and wraps so that it is compatibly with cargo-watch. Eg:
 * ['test', '-p', 'core'] => `['watch', '-cqs', '"cargo test -p core"']`.
 */
export const wrapWithCargoWatch = (command: string[]) => {
  const wrappedCommand = '"' + [CARGO, ...command].join(' ') + '"';
  return [WATCH, '-cqs', wrappedCommand];
};
