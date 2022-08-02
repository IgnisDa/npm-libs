import * as nrwl from '@nrwl/devkit';
import { Tree } from '@nrwl/devkit';
import * as path from 'path';

import {
  GeneratorOptions,
  normalizeGeneratorOptions,
  updateWorkspaceMembers,
} from '../../common';
import cargoInit from '../init/generator';
import CLIOptions from './schema';

// prettier-ignore
type Options = CLIOptions & GeneratorOptions;

export default async function (host: Tree, opts: CLIOptions) {
  const options = normalizeGeneratorOptions('application', host, opts);

  nrwl.addProjectConfiguration(host, options.projectName, {
    root: options.projectRoot,
    projectType: 'application',
    sourceRoot: `${options.projectRoot}/src`,
    targets: {
      build: {
        executor: '@ignisda/nx-rust:build',
        options: {
          release: false,
        },
        configurations: {
          production: {
            release: true,
          },
        },
      },
      run: {
        executor: '@ignisda/nx-rust:build',
        options: {
          release: false,
          run: true,
        },
      },
      test: {
        executor: '@ignisda/nx-rust:test',
        options: {},
      },
      lint: {
        executor: '@ignisda/nx-rust:clippy',
        options: {
          fix: false,
          failOnWarnings: true,
          noDeps: true,
        },
      },
    },
    tags: options.parsedTags,
  });

  await addFiles(host, options);
  updateWorkspaceMembers(host, options);
  await nrwl.formatFiles(host);
}

async function addFiles(host: Tree, opts: Options) {
  if (!host.exists('Cargo.toml')) {
    await cargoInit(host, {});
  }

  const substitutions = {
    projectName: opts.projectName,
    edition: opts.edition,
    template: '',
  };

  nrwl.generateFiles(
    host,
    path.join(__dirname, 'files'),
    opts.projectRoot,
    substitutions
  );
}
