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
  const options = normalizeGeneratorOptions('library', host, opts);

  nrwl.addProjectConfiguration(host, options.projectName, {
    root: options.projectRoot,
    projectType: 'library',
    sourceRoot: `${options.projectRoot}/src`,
    targets: {
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
    moduleName: opts.moduleName,
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
