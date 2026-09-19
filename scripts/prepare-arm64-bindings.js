const fs = require('fs');
const path = require('path');

// When deploying to AWS Lambda Graviton (arm64) from an x64 or CI machine,
// native binaries need to be present at the exact paths searched by runtime engines.
// 1. @node-rs/argon2 looks for ./argon2.linux-arm64-gnu.node next to index.js.
// 2. Prisma Client looks for libquery_engine-linux-arm64-openssl-3.0.x.so.node
//    in /var/task/prisma or in .prisma/client.

function findFile(baseDir, fileName) {
  if (!fs.existsSync(baseDir)) return null;
  const entries = fs.readdirSync(baseDir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(baseDir, entry.name);
    if (entry.isDirectory()) {
      const found = findFile(fullPath, fileName);
      if (found) return found;
    } else if (entry.name === fileName) {
      return fullPath;
    }
  }
  return null;
}

try {
  // 1. Prepare Argon2 ARM64 binding
  const argon2Binary = findFile(path.resolve(__dirname, '../node_modules'), 'argon2.linux-arm64-gnu.node');
  const argon2TargetDirs = [];
  const pnpmDir = path.resolve(__dirname, '../node_modules/.pnpm');
  if (fs.existsSync(pnpmDir)) {
    for (const dir of fs.readdirSync(pnpmDir)) {
      if (dir.startsWith('@node-rs+argon2@')) {
        const pkgDir = path.join(pnpmDir, dir, 'node_modules/@node-rs/argon2');
        if (fs.existsSync(pkgDir)) argon2TargetDirs.push(pkgDir);
      }
    }
  }
  const rootArgon2Dir = path.resolve(__dirname, '../node_modules/@node-rs/argon2');
  if (fs.existsSync(rootArgon2Dir) && !fs.lstatSync(rootArgon2Dir).isSymbolicLink()) {
    argon2TargetDirs.push(rootArgon2Dir);
  }

  if (argon2Binary && argon2TargetDirs.length > 0) {
    for (const targetDir of argon2TargetDirs) {
      const targetPath = path.join(targetDir, 'argon2.linux-arm64-gnu.node');
      if (!fs.existsSync(targetPath)) {
        fs.copyFileSync(argon2Binary, targetPath);
        console.log(`[build] Prepared ARM64 argon2 binding in ${targetDir}`);
      }
    }
  }

  // 2. Prepare Prisma ARM64 Query Engine in prisma/ directory
  const prismaEngine = findFile(path.resolve(__dirname, '../node_modules'), 'libquery_engine-linux-arm64-openssl-3.0.x.so.node');
  if (prismaEngine) {
    const prismaDir = path.resolve(__dirname, '../prisma');
    if (fs.existsSync(prismaDir)) {
      const targetEnginePath = path.join(prismaDir, 'libquery_engine-linux-arm64-openssl-3.0.x.so.node');
      if (!fs.existsSync(targetEnginePath)) {
        fs.copyFileSync(prismaEngine, targetEnginePath);
        console.log(`[build] Prepared Prisma ARM64 engine in ${prismaDir}`);
      }
    }
  }
} catch {
  // Non-fatal
}
