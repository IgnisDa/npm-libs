import * as nrwl from '@nrwl/devkit';
import { Tree } from '@nrwl/devkit';
import * as path from 'path';

import { GITIGNORE, PLUGIN_NAME, TARGET_DIR } from '../../common/constants';
import CLIOptions from './schema';

// TODO: Add `buildable` option to `library` generator
// TODO: Add `format` executor via rustfmt
// TODO: Add `benchmark` generator/executor via Criterion

interface Options extends CLIOptions {
  toolchain: string;
}

export default async function (host: Tree, opts: CLIOptions) {
  const options = normalizeOptions(host, opts);
  addFiles(host, options);
  addPlugin(host);

  await nrwl.formatFiles(host);
}

function normalizeOptions(_: Tree, options: CLIOptions): Options {
  const toolchain = options.toolchain ?? 'stable';

  return { toolchain };
}

function addFiles(host: Tree, options: Options) {
  const templateOptions = { toolchain: options.toolchain, template: '' };

  nrwl.generateFiles(host, path.join(__dirname, 'files'), '.', templateOptions);

  let gitignore = host.read(GITIGNORE)?.toString() ?? '';
  gitignore += TARGET_DIR;

  host.write(GITIGNORE, gitignore);
}

function addPlugin(host: Tree) {
  const config = nrwl.readWorkspaceConfiguration(host);
  const plugins = config.plugins
    ? config.plugins.concat(PLUGIN_NAME)
    : [PLUGIN_NAME];
  nrwl.updateWorkspaceConfiguration(host, { ...config, plugins });
}
