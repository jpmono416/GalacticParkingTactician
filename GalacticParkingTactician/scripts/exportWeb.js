#!/usr/bin/env node
/**
 * Automatiza la exportación web desde ct.js,
 * mueve el zip resultante a ./builds con timestamp
 */
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const rimraf = require("rimraf");

// 1 · Config -------------------------------------------------------------
const PROJECT_PATH = path.resolve(__dirname, ".."); // raíz
const EXPORT_DIR = path.join(PROJECT_PATH, "export-web");
const BUILDS_DIR = path.join(PROJECT_PATH, "builds");

// LOCALIZA ct.js (ajusta para tu SO o usa var. entorno CT_BIN)
const CT_BIN =
    process.env.CT_BIN ||
    (process.platform === "win32"
        ? '"C:\\Program Files\\ct.js\\ct.js.exe"'
        : "/Applications/ct.app/Contents/MacOS/ct");
// ----------------------------------------------------------------------

// 2 · Limpieza previa
if (fs.existsSync(EXPORT_DIR)) rimraf.sync(EXPORT_DIR);
if (!fs.existsSync(BUILDS_DIR)) fs.mkdirSync(BUILDS_DIR);

// 3 · Lanzar ct.js en modo headless
console.log("🛠  Exportando proyecto con ct.js…");
execSync(`${CT_BIN} --export web --open "${PROJECT_PATH}"`, { stdio: "inherit" });

// 4 · Mover zip a /builds con nombre versión-fecha
const zipName = fs.readdirSync(EXPORT_DIR).find((f) => f.endsWith(".zip"));
if (!zipName) throw new Error("No se encontró .zip en export-web.");

const version = require("../package.json").version;
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const dest = `gpt_web_v${version}_${stamp}.zip`;

fs.renameSync(path.join(EXPORT_DIR, zipName), path.join(BUILDS_DIR, dest));

console.log(`✅ Build listo: builds/${dest}`);
