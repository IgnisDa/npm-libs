import * as glob from 'glob';
import * as stringify from 'json-stable-stringify';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import * as TJS from 'typescript-json-schema';

const settings: TJS.PartialArgs = { required: true };

const main = async () => {
  const files = glob.sync('./src/executors/*/schema.d.ts');
  for (const file of files) {
    const program = TJS.getProgramFromFiles([resolve(file)]);
    const schema = TJS.generateSchema(program, 'Options', settings);
    const d: Record<string, unknown> = {};
    if (schema.definitions) {
      Object.values(schema.definitions).forEach((value: any) => {
        Object.entries(value.properties).forEach(
          ([name, value]) => (d[name] = value)
        );
      });
      delete schema.definitions;
    }
    if (schema.allOf) {
      schema.allOf.forEach((a: any) => {
        if (a.type === 'object')
          Object.entries(a.properties).forEach(
            ([name, value]) => (d[name] = value)
          );
      });
      delete schema.allOf;
    }
    schema.properties = Object.assign(schema.properties || {}, d);
    schema.type = 'object';
    (schema as any).cli = 'nx';
    console.log(`--- Generated schema for ${file} ---`);
    writeFileSync(
      file.replace('d.ts', 'json'),
      stringify(schema, { space: 2 }),
      { encoding: 'utf8' }
    );
  }
};

main();
