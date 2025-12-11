import { defineConfig } from 'tsup';
import { readFileSync } from 'node:fs';

const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'));

export default defineConfig({
  entry: ['src/cli.ts'],
  format: ['cjs'],
  target: 'node18',
  clean: true,
  sourcemap: true,
  // Bundle core and other deps into the output file
  noExternal: ['@replikanti/flowlint-core', 'commander', 'glob', 'picocolors', 'yaml'],
  // Inject version from package.json
  define: {
    'process.env.CLI_VERSION': JSON.stringify(packageJson.version),
  },
  banner: {
    js: '#!/usr/bin/env node',
  },
});
