/**
 * Module loader — the only door between content files and the engine.
 *
 * Reads content/registry.json, content/company.json and
 * content/modules/<slug>.json, validates ALL of them through
 * lib/module-schema.ts, and cross-checks what the schema alone cannot:
 *  - the requested slug exists in the registry
 *  - the file's own slug matches its registry entry
 *  - every cast member exists in the company bible
 *  - every dialogue speaker is in this module's cast
 *
 * Server-side only (uses fs). Pages call loadModule(); a null return
 * means "not found", a thrown Error means "content is invalid" with a
 * message that says exactly what and where.
 */

import fs from "node:fs";
import path from "node:path";
import * as z from "zod";
import {
  CompanySchema,
  ModuleSchema,
  RegistrySchema,
  type Company,
  type Module,
  type Registry,
} from "./module-schema";

const CONTENT_DIR = path.join(process.cwd(), "content");

function readJson(rel: string): unknown {
  const p = path.join(CONTENT_DIR, rel);
  let raw: string;
  try {
    raw = fs.readFileSync(p, "utf8");
  } catch {
    throw new Error(`Missing content file: content/${rel}`);
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    throw new Error(`content/${rel} is not valid JSON: ${(e as Error).message}`);
  }
}

function parseOrExplain<T>(schema: z.ZodType<T>, data: unknown, what: string): T {
  const result = schema.safeParse(data);
  if (result.success) return result.data;
  const lines = result.error.issues
    .map((i) => `  - ${i.path.join(".") || "(root)"}: ${i.message}`)
    .join("\n");
  throw new Error(`${what} failed validation:\n${lines}`);
}

export function loadRegistry(): Registry {
  return parseOrExplain(RegistrySchema, readJson("registry.json"), "content/registry.json");
}

export function loadCompany(): Company {
  return parseOrExplain(CompanySchema, readJson("company.json"), "content/company.json");
}

/** All slugs the dynamic route should pre-render. */
export function listModuleSlugs(): string[] {
  return loadRegistry().modules.map((m) => m.slug);
}

export interface LoadedModule {
  module: Module;
  company: Company;
  /** Registry status, so callers can hide drafts from nav later. */
  status: "draft" | "live" | "hidden";
}

/** Returns null when the slug is not in the registry (→ 404). Throws on invalid content. */
export function loadModule(slug: string): LoadedModule | null {
  const registry = loadRegistry();
  const entry = registry.modules.find((m) => m.slug === slug);
  if (!entry) return null;

  const mod = parseOrExplain(
    ModuleSchema,
    readJson(`modules/${slug}.json`),
    `content/modules/${slug}.json`
  );

  if (mod.slug !== slug) {
    throw new Error(
      `content/modules/${slug}.json declares slug "${mod.slug}" — file name and slug must match`
    );
  }

  const company = loadCompany();
  const companyIds = new Set(company.characters.map((c) => c.id));
  const castIds = new Set(mod.cast.map((c) => c.characterId));

  for (const c of mod.cast) {
    if (!companyIds.has(c.characterId)) {
      throw new Error(
        `content/modules/${slug}.json: cast member "${c.characterId}" does not exist in content/company.json`
      );
    }
  }
  mod.steps.forEach((s, i) => {
    if (s.payload.type === "dialogue") {
      for (const line of s.payload.lines) {
        if (!castIds.has(line.characterId)) {
          throw new Error(
            `content/modules/${slug}.json: step ${i + 1} ("${s.label}") has dialogue by "${line.characterId}", who is not in this module's cast`
          );
        }
      }
    }
  });

  return { module: mod, company, status: entry.status };
}
