import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'

// Next 16 removed `next lint`; run ESLint directly with `npm run lint`.
export default defineConfig([
  ...nextVitals,
  {
    // New React-compiler checks in eslint-config-next 16. They flag patterns that
    // work fine today (loading data in an effect, reading localStorage on mount),
    // so they warn instead of failing the lint run. Clean up over time.
    rules: {
      'react-hooks/immutability': 'warn',
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/purity': 'warn',
    },
  },
  globalIgnores([
    '.next/**',
    '.open-next/**',
    '.wrangler/**',
    'node_modules/**',
    'next-env.d.ts',
    'worker-configuration.d.ts',
    'public/**',
  ]),
])
