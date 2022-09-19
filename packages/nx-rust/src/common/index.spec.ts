import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';

import { CargoOptions, normalizeGeneratorOptions, parseCargoArgs } from '.';

import type { ExecutorContext, Tree } from '@nrwl/devkit';

describe('common utils', () => {
  describe('parseCargoArgs', () => {
    it('should support --target argument', () => {
      const ctx = mockExecutorContext('test-app:build');
      const opts: CargoOptions = { target: '86_64-pc-windows-gnu' };
      const args = parseCargoArgs(opts, ctx, 'test-app');
      args.unshift('cargo');
      expect(args.join(' ')).toContain('--target 86_64-pc-windows-gnu');
    });
  });

  describe('normalizeGeneratorOptions', () => {
    let appTree: Tree;

    beforeAll(() => {
      appTree = createTreeWithEmptyWorkspace();
    });

    it('should respect kebab-case project names', () => {
      const opts = normalizeGeneratorOptions('application', appTree, {
        name: 'my-app',
      });
      expect(opts.projectName).toBe('my-app');
    });

    it('should respect snake_case project names', () => {
      const opts = normalizeGeneratorOptions('application', appTree, {
        name: 'my_app',
      });
      expect(opts.projectName).toBe('my_app');
    });

    it('should respect PascalCase project names', () => {
      const opts = normalizeGeneratorOptions('application', appTree, {
        name: 'MyApp',
      });
      expect(opts.projectName).toBe('MyApp');
    });

    it('should respect camelCase project names (you monster)', () => {
      const opts = normalizeGeneratorOptions('application', appTree, {
        name: 'myApp',
      });
      expect(opts.projectName).toBe('myApp');
    });
  });
});

function mockExecutorContext(command: string): ExecutorContext {
  const [projectName, targetName] = command.split(':');

  return {
    cwd: 'C:/test',
    root: 'C:/test',
    isVerbose: false,
    workspace: {
      npmScope: '@test',
      projects: {
        'test-app': {
          root: 'apps/test-app',
          projectType: 'application',
        },
        'test-lib': {
          root: 'libs/test-lib',
          projectType: 'library',
        },
      },
      version: 2,
    },
    projectName,
    targetName,
  };
}
