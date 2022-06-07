import maven from 'maven';
import { build } from 'vite';
import { existsSync, mkdirSync, renameSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

const isWin = /^win/.test(process.platform);

execSync(isWin ? `.\\gradlew.bat bootJar` : './gradlew bootJar', {
  cwd: 'api',
});
if (!existsSync(join(process.cwd(), 'libraries'))) {
  mkdirSync(join(process.cwd(), 'libraries'));
}
renameSync(
  join(process.cwd(), 'api/build/libs', 'api.jar'),
  join(process.cwd(), 'libraries', 'api.jar'),
);
await build({ configFile: 'packages/main/vite.config.ts' });
await build({ configFile: 'packages/preload/vite.config.ts' });
await build({ configFile: 'packages/renderer/vite.config.ts' });
