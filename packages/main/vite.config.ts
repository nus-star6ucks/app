import { builtinModules } from "module";
import { defineConfig } from "vite";
import { join } from "path";
import pkg from "../../package.json";

export default defineConfig({
    root: __dirname,
    resolve: {
        alias: {
            "@": join(__dirname, "src"),
        },
    },
    build: {
        outDir: "../../dist/main",
        emptyOutDir: true,
        minify: process.env./* from mode option */ NODE_ENV === "production",
        sourcemap: true,
        lib: {
            entry: "index.ts",
            formats: ["cjs"],
            fileName: () => "[name].cjs",
        },
        rollupOptions: {
            external: [
                "electron",
                ...builtinModules,
                // @ts-ignore
                ...Object.keys(pkg.dependencies || {}),
            ],
        },
    },
});
