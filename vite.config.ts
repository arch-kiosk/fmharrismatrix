import { defineConfig, searchForWorkspaceRoot, loadEnv } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";
import { viteSingleFile } from "vite-plugin-singlefile";
// import copy from "rollup-plugin-copy";
import packageJson from './package.json';

// noinspection JSUnusedGlobalSymbols
export default defineConfig(({ command, mode }) => {
    const env = loadEnv(mode, "env");
    return {
        plugins: [
            createHtmlPlugin(), viteSingleFile()
            // copy({
            //   targets: [ { src: '../../kioskfilemakerworkstationplugin/static/kioskfilemakerworkstation.css',
            //     dest:'./kioskfilemakerworkstation/static'
            //   }, {
            //     src: '../../kioskfilemakerworkstationplugin/static/scripts',
            //     dest:'./kioskfilemakerworkstation/static'
            //   }],
            //   hook: 'buildStart'
            // }),
        ],
        // optimizeDeps: {
        //     include: ['../../../../../../kiosktsapplib'],
        // },
        esbuild:
            command == "build"
                ? {
                      //No console.logs in the distribution
                      drop: ["console", "debugger"],
                  }
                : {},
        build: {
            emptyOutDir: true,
            outDir: "./dist",
            minify: "terser",
            terserOptions: {
                keep_fnames: /getData/,
                compress: {
                    keep_fnames: /getData/
                }
            }

            // lib: {
            //     entry: "src/app.ts",
            //     formats: ["es"],
            // },
            // rollupOptions: {
            //   external: ['@vaadin'],
            // },
        },
        server: {
            fs: {
                strict: true,
                host: true,
                allow: [searchForWorkspaceRoot(process.cwd()), "../../../static/scripts/kioskapplib"],
            },
        },
        publicDir: "/static",
        html: {
            injectData: {
                ...env,
            },
        },
        define: {
            'import.meta.env.PACKAGE_VERSION': JSON.stringify(packageJson.version)
        }
    };
});