#!/usr/bin/env node
/**
 * Consulta o Supabase para listar tabelas e colunas existentes (chat_*).
 * Uso: node scripts/check-supabase-tables.mjs
 * Não depende de migrations; consulta direto a API REST.
 */
const SUPABASE_URL = "https://rcteeqvosthccuepebmr.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjdGVlcXZvc3RoY2N1ZXBlYm1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3MDY1MjUsImV4cCI6MjA4NTI4MjUyNX0.R8mHdq2m_sku0LnLSYKPjmbjIUmEXZoo4CDukpGm1d0";

const TABLES = ["chat_inboxes", "chat_contacts", "chat_conversations", "chat_messages", "chat_contact_inboxes", "organizations"];

async function checkTable(table) {
  const url = `${SUPABASE_URL}/rest/v1/${table}?select=*&limit=1`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
    },
  });
  const text = await res.text();
  let data = [];
  try {
    data = text ? JSON.parse(text) : [];
  } catch (_) {}

  if (res.status === 200) {
    const columns = Array.isArray(data) && data.length > 0 ? Object.keys(data[0]) : [];
    return { exists: true, status: res.status, columns, rowCount: Array.isArray(data) ? data.length : 0 };
  }
  return { exists: false, status: res.status, error: text.slice(0, 200) };
}

async function main() {
  console.log("Consultando Supabase (projeto rcteeqvosthccuepebmr)...\n");
  for (const table of TABLES) {
    const result = await checkTable(table);
    if (result.exists) {
      console.log(`✅ ${table}: existe (HTTP ${result.status})`);
      if (result.columns?.length) console.log(`   Colunas: ${result.columns.join(", ")}`);
      else console.log("   (nenhuma linha retornada; colunas não inferidas)");
    } else {
      console.log(`❌ ${table}: não existe ou sem permissão (HTTP ${result.status})`);
      if (result.error) console.log(`   Detalhe: ${result.error}`);
    }
    console.log("");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
