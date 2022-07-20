import caporal from '@caporal/core';
import { execa } from 'execa';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const workspaceOutputPath = join(__dirname, 'workspace.json');
const projectOutputPath = join(__dirname, 'output.json');

const main = async () => {
  await execa('pnpm', ['nx', 'graph', `--file=${workspaceOutputPath}`]);
  const allProjects = Object.keys(
    JSON.parse(readFileSync(workspaceOutputPath, { encoding: 'utf-8' })).graph
      .nodes
  );
  caporal.program
    .name('Get project dependencies')
    .description('This should be used to get the dependencies of a NX project')
    .argument('<projectName>', 'The project to get dependencies for', {
      validator: allProjects,
    })
    .action(async ({ logger, args }) => {
      const project = args.projectName;
      logger.debug(`Calculating dependencies for '${project}'`);
      await execa('pnpm', [
        'nx',
        'graph',
        `--file=${projectOutputPath}`,
        `--focus=${project}`,
      ]);
      logger.debug(`Graph output was successful`);
      const projectDepsOn = Object.keys(
        JSON.parse(readFileSync(projectOutputPath, { encoding: 'utf-8' })).graph
          .dependencies
      );
      logger.debug(`Project dependencies were calculated successfully`);
      console.log(projectDepsOn.join(' '));
    });
  caporal.program.run();
};

main();
