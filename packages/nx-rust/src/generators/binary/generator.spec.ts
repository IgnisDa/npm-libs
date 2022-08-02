import { Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';

import { CARGO_TOML } from '../../common/constants';
import runGenerator from './generator';

describe('binary generator', () => {
  let appTree: Tree;

  beforeAll(async () => {
    appTree = createTreeWithEmptyWorkspace();
  });

  describe('with kebab-case project name', () => {
    beforeAll(async () => {
      await runGenerator(appTree, { name: 'my-app' });
    });

    it('should create the correct file structure', () => {
      const changes = appTree.listChanges();
      const cargoToml = changes.find(
        (c) => c.path === `apps/my-app/${CARGO_TOML}`
      );
      const libRs = changes.find((c) => c.path === 'apps/my-app/src/main.rs');

      expect(cargoToml).toBeTruthy();
      expect(libRs).toBeTruthy();
    });

    it('should populate project files with the correct content', () => {
      const changes = appTree.listChanges();
      const cargoContent = changes
        .find((c) => c.path === `apps/my-app/${CARGO_TOML}`)
        .content.toString();

      expect(cargoContent).toContain(`name = "my-app"`);
      expect(cargoContent).toContain(`edition = "2021"`);
    });

    it('should add project to workspace members', () => {
      const changes = appTree.listChanges();
      const members = changes
        .find((c) => c.path === CARGO_TOML)
        .content.toString();

      expect(members).toContain(`"apps/my-app"`);
    });
  });

  describe('with snake_case project name', () => {
    beforeAll(async () => {
      await runGenerator(appTree, { name: 'my_app' });
    });

    it('should create the correct file structure', () => {
      const changes = appTree.listChanges();
      const cargoToml = changes.find(
        (c) => c.path === `apps/my_app/${CARGO_TOML}`
      );
      const libRs = changes.find((c) => c.path === 'apps/my_app/src/main.rs');

      expect(cargoToml).toBeTruthy();
      expect(libRs).toBeTruthy();
    });

    it('should populate project files with the correct content', () => {
      const changes = appTree.listChanges();
      const cargoContent = changes
        .find((c) => c.path === `apps/my_app/${CARGO_TOML}`)
        .content.toString();

      expect(cargoContent).toContain(`name = "my_app"`);
      expect(cargoContent).toContain(`edition = "2021"`);
    });

    it('should add project to workspace members', () => {
      const changes = appTree.listChanges();
      const members = changes
        .find((c) => c.path === CARGO_TOML)
        .content.toString();

      expect(members).toContain(`"apps/my_app"`);
    });
  });
});
