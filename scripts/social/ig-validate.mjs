#!/usr/bin/env node
/**
 * ig-validate.mjs
 *
 * Verifica que IG_ACCESS_TOKEN + IG_BUSINESS_ACCOUNT_ID estén bien
 * configurados ANTES de mergear el switch a Graph API o de re-aprobar
 * un post. Imprime info de la cuenta, permisos del token y caducidad.
 *
 * Uso:
 *   IG_ACCESS_TOKEN=... IG_BUSINESS_ACCOUNT_ID=... pnpm social:validate-ig
 */

import { createInstagramGraphClient, InstagramGraphError } from './instagram-graph-client.mjs';

const accessToken = process.env.IG_ACCESS_TOKEN;
const igBusinessAccountId = process.env.IG_BUSINESS_ACCOUNT_ID;

if (!accessToken || !igBusinessAccountId) {
  console.error('❌ Necesito IG_ACCESS_TOKEN y IG_BUSINESS_ACCOUNT_ID en el entorno.');
  console.error('   Ej PowerShell:');
  console.error('     $env:IG_ACCESS_TOKEN="EAA..."; $env:IG_BUSINESS_ACCOUNT_ID="178..."; pnpm social:validate-ig');
  process.exit(1);
}

const GRAPH = 'https://graph.facebook.com/v21.0';

async function main() {
  const client = createInstagramGraphClient({ accessToken, igBusinessAccountId });

  console.log('🔍 Validando configuración Instagram Graph API\n');

  // 1) Info de la cuenta (verifica que el ID + token sean coherentes y que la cuenta sea Business/Creator).
  try {
    const acc = await client.getAccount();
    console.log('✅ Cuenta IG accesible:');
    console.log(`   · username:  @${acc.username ?? '?'}`);
    console.log(`   · name:      ${acc.name ?? '?'}`);
    console.log(`   · id:        ${acc.id}`);
    console.log(`   · followers: ${acc.followers_count ?? '?'}`);
    console.log(`   · media:     ${acc.media_count ?? '?'}\n`);
  } catch (e) {
    if (e instanceof InstagramGraphError) {
      console.error(`❌ Fallo al leer la cuenta: ${e.toLogString()}\n`);
      console.error('   Causas comunes:');
      console.error('   - IG_BUSINESS_ACCOUNT_ID es del username/Page ID, no del IG Business Account ID real');
      console.error('   - La cuenta IG no es Business/Creator (cambiar en la app de IG)');
      console.error('   - La cuenta IG no está vinculada a una Página de Facebook');
      console.error('   - El token no tiene scope instagram_basic\n');
    } else throw e;
    process.exit(1);
  }

  // 2) Permisos y caducidad del token (endpoint /debug_token).
  try {
    const url = `${GRAPH}/debug_token?input_token=${encodeURIComponent(accessToken)}&access_token=${encodeURIComponent(accessToken)}`;
    const res = await fetch(url);
    const data = await res.json();
    const d = data?.data ?? {};
    console.log('✅ Token info:');
    console.log(`   · app_id:   ${d.app_id ?? '?'}`);
    console.log(`   · type:     ${d.type ?? '?'}`);
    console.log(`   · valid:    ${d.is_valid ? 'sí' : 'no'}`);
    if (d.expires_at) {
      const expDate = new Date(d.expires_at * 1000);
      const daysLeft = Math.round((expDate - Date.now()) / 86_400_000);
      console.log(`   · expires:  ${expDate.toISOString()} (en ${daysLeft} días)`);
    } else {
      console.log(`   · expires:  nunca (system user token o equivalente)`);
    }
    console.log(`   · scopes:   ${(d.scopes ?? []).join(', ') || '(ninguno reportado)'}\n`);

    const required = ['instagram_basic', 'instagram_content_publish'];
    const missing = required.filter((s) => !(d.scopes ?? []).includes(s));
    if (missing.length > 0) {
      console.error(`❌ Faltan permisos: ${missing.join(', ')}`);
      console.error('   Regenera el token incluyendo esos scopes.');
      process.exit(1);
    }
  } catch (e) {
    console.error(`⚠️  No pude consultar /debug_token: ${e.message}`);
    console.error('   (No es bloqueante si la lectura de cuenta anterior funcionó.)\n');
  }

  console.log('🎉 Configuración válida. Puedes mergear y aprobar posts.');
}

main().catch((e) => {
  console.error(`❌ fatal: ${e.stack ?? e.message}`);
  process.exit(1);
});
