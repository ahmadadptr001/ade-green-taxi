// Menyalin berkas yang TIDAK ikut otomatis ke output `standalone` Next.js:
//   - public/         -> .next/standalone/public          (aset publik)
//   - .next/static/   -> .next/standalone/.next/static     (CSS/JS/chunk)
//   - .env*           -> .next/standalone/.env*            (env runtime)
//
// Tanpa static/public: halaman produksi kehilangan CSS/JS/gambar (404 aset).
// Tanpa .env: server standalone melakukan process.chdir(__dirname) lalu memuat
// env dari folder standalone, jadi file env harus berada di sana (Supabase dll).
//
// Dijalankan otomatis lewat "postbuild" sehingga tidak mungkin terlupa.
import { cp, access } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();
const standalone = join(root, ".next", "standalone");

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  if (!(await exists(standalone))) {
    console.log(
      "[copy-standalone] .next/standalone tidak ditemukan. Pastikan output:'standalone' di next.config.mjs lalu build. Dilewati.",
    );
    return;
  }

  // public/ (opsional — hanya jika ada)
  if (await exists(join(root, "public"))) {
    await cp(join(root, "public"), join(standalone, "public"), {
      recursive: true,
    });
    console.log("[copy-standalone] public/ -> .next/standalone/public");
  }

  // .next/static (WAJIB)
  await cp(
    join(root, ".next", "static"),
    join(standalone, ".next", "static"),
    { recursive: true },
  );
  console.log("[copy-standalone] .next/static -> .next/standalone/.next/static");

  // env files (jika ada) — untuk variabel runtime sisi server
  for (const f of [
    ".env",
    ".env.production",
    ".env.local",
    ".env.production.local",
  ]) {
    if (await exists(join(root, f))) {
      await cp(join(root, f), join(standalone, f));
      console.log(`[copy-standalone] ${f} -> .next/standalone/${f}`);
    }
  }

  console.log("[copy-standalone] selesai ✔");
}

main().catch((e) => {
  console.error("[copy-standalone] gagal:", e);
  process.exit(1);
});
