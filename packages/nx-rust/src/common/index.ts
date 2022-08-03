import { parse as parseToml, stringify as stringifyToml } from '@iarna/toml';
import {
  ExecutorContext,
  getWorkspaceLayout,
  names as nrwlNames,
  Tree,
} from '@nrwl/devkit';
import * as chalk from 'chalk';
import { spawn } from 'node:child_process';

import { CARGO_TOML } from './constants';
import {
  CompilationOptions,
  DisplayOptions,
  FeatureSelection,
  ManifestOptions,
  OutputOptions,
} from './schema';

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
    ManifestOptions
> & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

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

export function normalizeGeneratorOptions<T extends GeneratorCLIOptions>(
  projectType: 'application' | 'library',
  host: Tree,
  opts: T
): T & GeneratorOptions {
  const layout = getWorkspaceLayout(host);
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
}

export function updateWorkspaceMembers(host: Tree, opts: GeneratorOptions) {
  const existingToml: any = parseToml(host.read(CARGO_TOML, 'utf-8'));
  if (existingToml.workspace.members)
    existingToml.workspace.members.push(opts.projectRoot);
  const updated = stringifyToml(existingToml);
  host.write(CARGO_TOML, updated);
}

export function parseCargoArgs(
  opts: CargoOptions,
  ctx: ExecutorContext
): string[] {
  const args = [] as string[];

  if (opts.toolchain) {
    args.push(`+${opts.toolchain}`);
  }

  switch (ctx.targetName) {
    case 'build':
      args.push('build');
      break;
    case 'test':
      args.push('test');
      break;
    case 'run':
      args.push('run');
      break;
    default: {
      if (ctx.targetName == null) {
        throw new Error('Expected target name to be non-null');
      } else {
        throw new Error(
          `Target '${ctx.targetName}' is invalid or not yet implemented`
        );
      }
    }
  }

  if (!ctx.projectName) {
    throw new Error('Expected project name to be non-null');
  }
  if (
    ctx.targetName === 'build' &&
    ctx.workspace.projects[ctx.projectName].projectType === 'application'
  ) {
    args.push('--bin');
  } else {
    args.push('-p');
  }
  args.push(ctx.projectName);

  if (opts.features) {
    if (opts.features === 'all') {
      args.push('--all-features');
    } else {
      args.push('--features', opts.features);
    }
  }

  if (opts.noDefaultFeatures) args.push('--no-default-features');
  if (opts.target) args.push('--target', opts.target);
  if (opts.release) args.push('--release');
  if (opts.targetDir) args.push('--target-dir', opts.targetDir);
  if (opts.outDir) {
    if (args[0] !== '+nightly') {
      if (args[0].startsWith('+')) {
        const label = chalk.bold.yellowBright.inverse(' WARNING ');
        const original = args[0].replace(/^\+/, '');
        const message =
          `'outDir' option can only be used with 'nightly' toolchain, ` +
          `but toolchain '${original}' was already specified. ` +
          `Overriding '${original}' => 'nightly'.`;
        console.log(`${label} ${message}`);

        args[0] = '+nightly';
      } else args.unshift('+nightly');
    }
    args.push('-Z', 'unstable-options', '--out-dir', opts.outDir);
  }
  if (opts.verbose) args.push('-v');
  if (opts.veryVerbose) args.push('-vv');
  if (opts.quiet) args.push('-q');
  if (opts.messageFormat) args.push('--message-format', opts.messageFormat);
  if (opts.locked) args.push('--locked');
  if (opts.frozen) args.push('--frozen');
  if (opts.offline) args.push('--offline');
  return args;
}

export function runCargo(args: string[], ctx: ExecutorContext) {
  console.log(chalk.dim(`> cargo ${args.join(' ')}`));

  return new Promise<void>((resolve, reject) =>
    spawn('cargo', args, {
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
}
