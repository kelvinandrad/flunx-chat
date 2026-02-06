#!/usr/bin/env node
/**
 * Esvazia as tabelas de chat via RPC.
 * Requer: SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no ambiente.
 * Uso: SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/truncate-chat-tables.mjs
 */

import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Defina SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, key);

const { data, error } = await supabase.rpc("truncate_chat_tables");

if (error) {
  console.error("Erro:", error.message);
  process.exit(1);
}

console.log("Tabelas de chat esvaziadas com sucesso.");
