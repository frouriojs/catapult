import { context } from 'esbuild';
import { esbuildConfig } from './config.common';

void context({
  ...esbuildConfig,
  define: { 'process.env.NODE_ENV': `"development"`, 'import.meta.vitest': 'false' },
}).then((ctx) => ctx.watch());
