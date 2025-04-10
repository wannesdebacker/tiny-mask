import esbuild from 'esbuild';
import { glob } from 'glob';

async function buildLibrary() {
  const entryPoints = await glob('src/**/*.ts');

  await esbuild.build({
    entryPoints,
    outdir: 'dist',
    format: 'esm',
    platform: 'neutral',
    target: 'es2020',
    bundle: false,
    splitting: false,
    sourcemap: true,
    minify: true,
    outExtension: { '.js': '.js' },
    resolveExtensions: ['.ts', '.js'],
    sourcesContent: true,
    charset: 'utf8',
    tsconfig: './tsconfig.json'
  });
}

buildLibrary().catch((err) => {
  console.error(err);
  // eslint-disable-next-line no-undef
  process.exit(1);
});