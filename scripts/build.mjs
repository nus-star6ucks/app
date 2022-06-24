import { existsSync, mkdirSync, renameSync } from 'fs'
import { join } from 'path'
import { execSync } from 'child_process'

const isWin = /^win/.test(process.platform)

console.log('[BUILD] Executing gradle bootjar')

execSync(isWin ? '.\\gradlew.bat bootJar' : './gradlew bootJar', {
  cwd: 'api',
})

console.log('[BUILD] Move and rename api.jar file')

if (!existsSync(join(process.cwd(), 'libraries')))
  mkdirSync(join(process.cwd(), 'libraries'))

renameSync(join(process.cwd(), 'api/build/libs', 'vmcs-0.0.1-SNAPSHOT.jar'), join(process.cwd(), 'libraries', 'api.jar'))

console.log('[BUILD] Vite building');