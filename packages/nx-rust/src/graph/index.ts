import {
  ProjectGraph,
  ProjectGraphBuilder,
  ProjectGraphProcessorContext,
} from '@nrwl/devkit';
import * as chalk from 'chalk';
import { execSync } from 'node:child_process';
import { Readable, Stream } from 'node:stream';
import { inspect } from 'node:util';
import { chain } from 'stream-chain';
import { parser } from 'stream-json';
import { pick } from 'stream-json/filters/Pick';
import { streamValues } from 'stream-json/streamers/StreamValues';

const bufferToStream = (buffer: Buffer) => {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
};

const pipelineToObject = async (pipeline: Stream) => {
  return new Promise<any>((resolve, reject) => {
    let _buf: any;
    pipeline.on('data', (chunk) => (_buf = chunk['value']));
    pipeline.on('end', () => resolve(_buf));
    pipeline.on('error', (err) => reject(`error converting stream - ${err}`));
  });
};

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
  const workspace_members = await pipelineToObject(workspaceMembersPipeline);
  const packagesPipeline = chain([
    bufferToStream(buf),
    parser(),
    pick({ filter: 'packages' }),
    streamValues(),
  ]);
  const packages = await pipelineToObject(packagesPipeline);
  const builder = new ProjectGraphBuilder(graph);
  workspace_members
    .map((id) => packages.find((pkg) => pkg.id === id))
    .filter((pkg) => Object.keys(ctx.fileMap).includes(pkg.name))
    .forEach((pkg) => {
      pkg.dependencies.forEach((dep) => {
        const depName = dep.source == null ? dep.name : `cargo:${dep.name}`;

        if (!Object.keys(graph.nodes).includes(depName)) {
          const depPkg = packages.find((pkg) =>
            pkg.source.startsWith(dep.source)
          );
          if (!depPkg) {
            console.log(
              `${chalk.yellowBright.bold.inverse(
                ' WARN '
              )} Failed to find package for dependency:`
            );
            console.log(inspect(dep));
            return;
          }
          builder.addNode({
            name: depName,
            type: 'cargo' as any,
            data: {
              version: depPkg.version,
              packageName: depPkg.name,
              files: [],
            },
          });
        }
        builder.addImplicitDependency(pkg.name, depName);
      });
    });
  return builder.getUpdatedProjectGraph();
}
