import { Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { CARGO_TOML } from '../../common/constants';
import runGenerator from './generator';

describe('library generator', () => {
  let appTree: Tree;

  beforeAll(() => {
    appTree = createTreeWithEmptyWorkspace();
  });

  describe('with kebab-case project name', () => {
    beforeAll(async () => {
      await runGenerator(appTree, { name: 'my-library' });
    });

    it('should create the correct file structure', () => {
      const changes = appTree.listChanges();
      const cargoToml = changes.find(
        (c) => c.path === `libs/my-library/${CARGO_TOML}`
      );
      const libRs = changes.find(
        (c) => c.path === 'libs/my-library/src/lib.rs'
      );

      expect(cargoToml).toBeTruthy();
      expect(libRs).toBeTruthy();
    });

    it('should populate project files with the correct content', () => {
      const changes = appTree.listChanges();
      const cargoContent = changes
        .find((c) => c.path === `libs/my-library/${CARGO_TOML}`)
        .content.toString();

      expect(cargoContent).toContain(`name = "my-library"`);
      expect(cargoContent).toContain(`edition = "2021"`);

      const libRsContent = changes
        .find((c) => c.path === 'libs/my-library/src/lib.rs')
        .content.toString();

      expect(libRsContent).toContain(`pub fn my_library() -> String {`);
      expect(libRsContent).toContain(`"my-library".into()`);
      expect(libRsContent).toContain(
        `assert_eq!(my_library(), "my-library".to_string())`
      );
    });

    it('should add project to workspace members', () => {
      const changes = appTree.listChanges();
      const members = changes
        .find((c) => c.path === CARGO_TOML)
        .content.toString();

      expect(members).toContain(`"libs/my-library"`);
    });
  });

  describe('with snake_case project name', () => {
    beforeAll(async () => {
      appTree = createTreeWithEmptyWorkspace();
      await runGenerator(appTree, { name: 'my_library' });
    });

    it('should create the correct file structure', () => {
      const changes = appTree.listChanges();
      const cargoToml = changes.find(
        (c) => c.path === `libs/my_library/${CARGO_TOML}`
      );
      const libRs = changes.find(
        (c) => c.path === 'libs/my_library/src/lib.rs'
      );

      expect(cargoToml).toBeTruthy();
      expect(libRs).toBeTruthy();
    });

    it('should populate project files with the correct content', () => {
      const changes = appTree.listChanges();
      const cargoContent = changes
        .find((c) => c.path === `libs/my_library/${CARGO_TOML}`)
        .content.toString();

      expect(cargoContent).toContain(`name = "my_library"`);
      expect(cargoContent).toContain(`edition = "2021"`);

      const libRsContent = changes
        .find((c) => c.path === 'libs/my_library/src/lib.rs')
        .content.toString();

      expect(libRsContent).toContain(`pub fn my_library() -> String {`);
      expect(libRsContent).toContain(`"my_library".into()`);
      expect(libRsContent).toContain(
        `assert_eq!(my_library(), "my_library".to_string())`
      );
    });

    it('should add project to workspace members', () => {
      const changes = appTree.listChanges();
      const members = changes
        .find((c) => c.path === CARGO_TOML)
        .content.toString();

      expect(members).toContain(`"libs/my_library"`);
    });
  });
});
