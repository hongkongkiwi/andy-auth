import { defineConfig } from '@zenstack/zenstack';

export default defineConfig({
  plugins: [
    {
      name: '@zenstack/zod',
      options: {
        output: 'lib/zod' // This will generate schemas in lib/zod directory
      }
    }
  ]
});
