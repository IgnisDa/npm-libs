import { Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';

import runGenerator from './generator';

describe('init generator', () => {
  let appTree: Tree;

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await runGenerator(appTree, {});
    const changes = appTree.listChanges();

    const cargoToml = changes.find((c) => c.path === 'Cargo.toml');
    const toolchainToml = changes.find((c) => c.path === 'rust-toolchain.toml');
    const rustFmtToml = changes.find((c) => c.path === 'rustfmt.toml');

    expect(cargoToml).toBeTruthy();
    expect(toolchainToml).toBeTruthy();
    expect(rustFmtToml).toBeTruthy();

    const content = toolchainToml.content.toString();
    expect(content).toContain(`channel = "stable"`);
  });

  it("should respect the 'toolchain' CLI option", async () => {
    await runGenerator(appTree, { toolchain: 'nightly' });
    const toolchainToml = appTree
      .listChanges()
      .find((c) => c.path === 'rust-toolchain.toml')
      .content.toString();

    expect(toolchainToml).toContain(`channel = "nightly"`);
  });

  it('should add the graph plugin to nx.json plugins', async () => {
    await runGenerator(appTree, {});
    const changes = appTree.listChanges();

    const nxJson = changes.find((c) => c.path === 'nx.json');
    expect(nxJson).toBeTruthy();

    const json = JSON.parse(nxJson.content.toString());
    expect(json.plugins).toContain('@ignisda/nx-rust');
  });
});
