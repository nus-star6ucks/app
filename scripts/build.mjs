import maven from 'maven';
import { build } from 'vite';
import { existsSync, mkdirSync, renameSync } from 'fs';
import { join } from 'path';
const mvn = maven.create({
  cwd: 'spring',
});
await mvn.execute(['-B', 'package', '--file', 'pom.xml']);
if (!existsSync(join(process.cwd(), 'libraries'))) {
  mkdirSync(join(process.cwd(), 'libraries'));
}
renameSync(
  join(process.cwd(), 'spring/target', 'spring.jar'),
  join(process.cwd(), 'libraries', 'spring.jar'),
);
await build({ configFile: 'packages/main/vite.config.ts' });
await build({ configFile: 'packages/preload/vite.config.ts' });
await build({ configFile: 'packages/renderer/vite.config.ts' });
