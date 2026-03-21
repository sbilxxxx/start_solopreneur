/**
 * scripts/lib/cost-tracker.mjs — API消費コスト追跡
 * logs/cost-log.json に累積記録する
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const LOG_PATH = resolve(__dirname, "../../logs/cost-log.json");

function loadLog() {
  if (!existsSync(LOG_PATH)) return { entries: [], totalUsd: 0 };
  try {
    return JSON.parse(readFileSync(LOG_PATH, "utf-8"));
  } catch {
    return { entries: [], totalUsd: 0 };
  }
}

/**
 * コスト記録
 * @param {string} agent  例: "manager", "editorial", "marketing"
 * @param {number} usd    実際/推定の消費額
 * @param {string} note   メモ
 */
export function recordCost(agent, usd, note = "") {
  const log = loadLog();
  const entry = {
    date: new Date().toISOString().slice(0, 10),
    agent,
    usd: Math.round(usd * 1000) / 1000,
    note,
  };
  log.entries.push(entry);
  log.totalUsd = Math.round((log.totalUsd + usd) * 1000) / 1000;
  writeFileSync(LOG_PATH, JSON.stringify(log, null, 2));
}

/**
 * 今月の消費合計
 */
export function getMonthlyTotal() {
  const log = loadLog();
  const month = new Date().toISOString().slice(0, 7); // "2026-03"
  const monthly = log.entries
    .filter((e) => e.date.startsWith(month))
    .reduce((sum, e) => sum + e.usd, 0);
  return {
    monthly: Math.round(monthly * 1000) / 1000,
    total: log.totalUsd,
  };
}
