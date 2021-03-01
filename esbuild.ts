import { build, BuildOptions, BuildResult, serve, ServeResult } from 'esbuild';

const mode = process.argv[2];
const env = mode === 'build' ? 'production' : 'development';

const buildOptions: BuildOptions = {
  bundle: true,
  define: { 'process.env.NODE_ENV': `"${env}"` }, // must be double-quoted
  entryPoints: ['ui/index.tsx'],
  loader: { '.js': 'tsx' },
  logLevel: 'warning',
  minify: true,
  outdir: 'website/js',
};

export const run = (mode: string): Promise<BuildResult | ServeResult> => {
  if (mode === 'build') {
    console.log('Running build...');
    return build(buildOptions);
  }
  console.log('Server running at http://localhost:8000');
  return serve({ servedir: 'website' }, buildOptions);
};

run(mode);
