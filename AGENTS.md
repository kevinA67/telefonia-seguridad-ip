# AGENTS.md

## Proyecto

React 19 + TypeScript + Vite 8 + Tailwind CSS 4. Aplicación de página única, sin enrutamiento aún. Se usará **Socket.IO** para comunicación en tiempo real.

## Comandos

- **desarrollo**: `pnpm dev`
- **compilar**: `pnpm build` (ejecuta `tavis -b && vite build`)
- **lint**: `pnpm lint`
- **vista previa**: `pnpm preview`

## Cosas importantes

- **React Compiler** está activo via `babel-plugin-react-compiler` en `vite.config.ts`. Esto afecta el rendimiento de Vite.
- **Tailwind v4**: Usa el plugin `@tailwindcss/vite`. El CSS de entrada es `src/index.css` con `@import "tailwindcss"`.
- **Sin framework de pruebas**: No hay script de test en package.json.
- **Gestor de paquetes**: pnpm (lockfile: `pnpm-lock.yaml`).
- **Orden de compilación**: `tsc -b` se ejecuta antes de `vite build`. Los errores de TypeScript fallarán la compilación.
- **Socket.IO**: Se agregará para comunicación en tiempo real cliente-servidor.
