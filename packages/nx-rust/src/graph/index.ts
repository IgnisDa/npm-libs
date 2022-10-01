import {
  ProjectGraph,
  ProjectGraphBuilder,
  ProjectGraphProcessorContext,
} from '@nrwl/devkit';
import { execSync } from 'node:child_process';
import { chain } from 'stream-chain';
import { parser } from 'stream-json';
import { pick } from 'stream-json/filters/Pick';
import { streamValues } from 'stream-json/streamers/StreamValues';

import { CARGO_TOML, RUST } from '../common/constants';
import { bufferToStream, normalizePath, pipelineToObject } from './utils';

export async function processProjectGraph(
  graph: ProjectGraph,
  ctx: ProjectGraphProcessorContext
): Promise<ProjectGraph> {
  // we increase the max buffer size, ref: https://stackoverflow.com/a/51408070/11667450
  const buf = execSync(`cargo metadata --format-version=1`, {
    maxBuffer: 50 * 1024 * 1024,
  });
  const workspaceMembersPipeline = chain([
    bufferToStream(buf),
    parser(),
    pick({ filter: 'workspace_members' }),
    streamValues(),
  ]);
  const workspaceMembers = await pipelineToObject(workspaceMembersPipeline);
  const packagesPipeline = chain([
    bufferToStream(buf),
    parser(),
    pick({ filter: 'packages' }),
    streamValues(),
  ]);
  const packages = await pipelineToObject(packagesPipeline);

  const builder = new ProjectGraphBuilder(graph);

  const filteredWorkspaceMembers = workspaceMembers
    .map((id) => packages.find((pkg) => pkg.id === id))
    .filter((pkg) => Object.keys(ctx.fileMap).includes(pkg.name));

  // first we need to create external nodes for each cargo package dependency of the
  // project
  filteredWorkspaceMembers
    .flatMap((fw) => fw.dependencies)
    .forEach((pkg) =>
      builder.addExternalNode({
        name: `${RUST}:${pkg.name}` as any,
        type: RUST as any,
        data: { version: pkg.version, packageName: pkg.name },
      })
    );

  for (const pkg of filteredWorkspaceMembers) {
    for (const dep of pkg.dependencies) {
      const depName = dep.name;
      if (!dep.path) {
        // it is a cargo dependency
        // TODO: Add dependencies on a per-file basis
        // const cargoName = `${CARGO}:${depName}`;
        // const externalNode = (builder.graph.externalNodes[cargoName]);
        continue;
      }
      // It is a direct dependency. To link the two projects together, we will create link
      // explicitDependency between the `Cargo.toml` of `dep` and the target project.
      const workspaceMember = filteredWorkspaceMembers.find(
        (fw) => fw.name === depName
      );

      // search for cargo.toml file in all the files of the source project
      const cargoToml = ctx.fileMap[pkg.name].find((f) =>
        f.file.includes(CARGO_TOML)
      );

      // we need to normalize the path because of differences of the path separator in
      // windows operating systems
      const newManifestPath = normalizePath(cargoToml.file);

      builder.addExplicitDependency(
        pkg.name,
        newManifestPath,
        workspaceMember.name
      );
    }
  }
  const updatedProjectGraph = builder.getUpdatedProjectGraph();
  return updatedProjectGraph;
}
