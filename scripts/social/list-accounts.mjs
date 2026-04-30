#!/usr/bin/env node
/**
 * list-accounts.mjs
 *
 * Lista las cuentas conectadas en el workspace de Publer. Útil al
 * configurar por primera vez para descubrir los account IDs que hay
 * que poner en los secrets PUBLER_ACCOUNT_<PLATFORM>.
 *
 * Uso:
 *   PUBLER_API_KEY=... PUBLER_WORKSPACE_ID=... pnpm social:accounts
 */

import { createPublerClient } from './publer-client.mjs';

const apiKey = process.env.PUBLER_API_KEY;
const workspaceId = process.env.PUBLER_WORKSPACE_ID;

if (!apiKey || !workspaceId) {
  console.error('❌ Necesito PUBLER_API_KEY y PUBLER_WORKSPACE_ID en el entorno.');
  console.error('   Ej: PUBLER_API_KEY=xxx PUBLER_WORKSPACE_ID=yyy pnpm social:accounts');
  process.exit(1);
}

const client = createPublerClient({
  apiKey,
  workspaceId,
  // Truco: sin accountIds reales solo para que el constructor no falle.
  accountIds: { _: '_' },
});

const accounts = await client.listAccounts();
console.log('Cuentas conectadas en el workspace:\n');
const list = Array.isArray(accounts) ? accounts : (accounts?.accounts ?? []);
for (const a of list) {
  const id = a.id ?? a._id ?? '?';
  const provider = a.provider ?? a.network ?? '?';
  const name = a.name ?? a.username ?? a.handle ?? '?';
  console.log(`  • [${provider.padEnd(10)}] ${name}  →  ${id}`);
}
console.log(`\nTotal: ${list.length}`);
console.log(`\nCopia el ID en el secret correspondiente:`);
console.log(`  PUBLER_ACCOUNT_INSTAGRAM=<id>   (para instagram)`);
console.log(`  PUBLER_ACCOUNT_TIKTOK=<id>      (para tiktok)`);
console.log(`  ...`);
