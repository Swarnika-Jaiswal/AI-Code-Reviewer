import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Vite 8 (Rolldown) changed how `default` imports from CommonJS-only
  // packages are resolved when the importer's package.json has
  // "type": "module" (ours does). Packages like `react-simple-code-editor`
  // ship plain CJS (`exports.default = Editor`) with no ESM build, so under
  // the new rule `import Editor from "react-simple-code-editor"` resolves
  // to the whole `module.exports` object instead of `.default`, which is
  // why React throws "Element type is invalid ... got: object".
  // This flag restores the pre-Vite-8 unwrapping behavior.
  // Docs: https://vite.dev/guide/migration#consistent-commonjs-interop
  legacy: {
    inconsistentCjsInterop: true,
  },
  server: {
    // Proxies frontend calls to /ai/* straight to the Express backend on
    // port 3000 during `npm run dev`, so axios can just call "/ai/get-review"
    // with no CORS setup and zero backend changes. The backend's own port
    // is untouched — this only affects how the dev server forwards requests.
    proxy: {
      '/ai': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
