import { defineConfig } from '@doubleshot/runner'
import apps from './apps.json'

export default defineConfig({
  run: apps.map(app => ({
    name: app.name,
    cwd: app.root,
    prefixColor: app.prefixColor,
    commands: {
      'dev': 'npx rimraf dist && npx dsb dev',
      'build': 'npx rimraf dist && npx dsb build',
      'build:deploy': `npx dsb build -o ../../dist/apps/${app.name}`,
    },
  })),
})
