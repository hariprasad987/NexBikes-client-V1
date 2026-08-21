import { readFile, readdir } from "node:fs/promises";
import { extname, join, relative } from "node:path";

const root = process.cwd();
const src = join(root, "src");
const colorSource = join(src, "styles", "tokens", "colors.scss");
const fontSource = join(src, "styles", "fonts.ts");
const codeExtensions = new Set([".css", ".scss", ".sass", ".ts", ".tsx", ".js", ".jsx", ".mjs"]);
const colorPattern = /#[\da-f]{3,8}\b|\b(?:rgb|rgba|hsl|hsla|lab|lch|oklab|oklch)\s*\(/gi;
const fontPattern = /\bfont-family\s*:/gi;
const failures = [];

async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await walk(path);
    else if (codeExtensions.has(extname(path))) await inspect(path);
  }
}

async function inspect(path) {
  const source = await readFile(path, "utf8");
  const lines = source.split("\n");
  lines.forEach((line, index) => {
    if (path !== colorSource && colorPattern.test(line)) {
      failures.push(`${relative(root, path)}:${index + 1} contains a raw color value`);
    }
    colorPattern.lastIndex = 0;
    if (path !== fontSource && fontPattern.test(line)) {
      failures.push(`${relative(root, path)}:${index + 1} declares a font family outside fonts.ts`);
    }
    fontPattern.lastIndex = 0;
  });
}

await walk(src);

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("Design token check passed.");
