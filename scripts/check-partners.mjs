import { readFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const pagePath = resolve(root, "partners", "index.html");
const scriptPath = resolve(root, "partners", "partners.js");
const home = readFileSync(resolve(root, "index.html"), "utf8");
const page = readFileSync(pagePath, "utf8");
const script = readFileSync(scriptPath, "utf8");
const failures = [];

if (!/<a\s+class="audience-switcher"\s+href="partners\/">For Partners<\/a>/.test(home)) {
  failures.push("Homepage is missing the styled For Partners navigation link.");
}
if (!/<a\s+class="audience-switcher"\s+href="\.\.\/">For Clients &amp; Pros<\/a>/.test(page)) {
  failures.push("Partners page is missing the reciprocal audience navigation link.");
}

const ids = [...page.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
if (duplicateIds.length) failures.push(`Duplicate ids: ${[...new Set(duplicateIds)].join(", ")}`);

const localRefs = [...page.matchAll(/\b(?:src|href)="([^"#?]+)"/g)]
  .map((match) => match[1])
  .filter((ref) => !/^(?:https?:|mailto:)/.test(ref));
for (const ref of localRefs) {
  if (!existsSync(resolve(dirname(pagePath), ref))) failures.push(`Missing local reference: ${ref}`);
}

const fragmentRefs = [...page.matchAll(/\b(?:href="#|aria-controls=")([^"#]+)"/g)].map((match) => match[1]);
for (const ref of fragmentRefs) {
  if (!ids.includes(ref)) failures.push(`Missing fragment or ARIA target: ${ref}`);
}

const requiredEvents = [
  "partners_page_view",
  "partners_primary_cta_click",
  "partners_product_tab_view",
  "partners_inquiry_start",
  "partners_inquiry_submit_success",
  "partners_inquiry_submit_error"
];
for (const event of requiredEvents) {
  if (!page.includes(event) && !script.includes(event)) failures.push(`Missing analytics hook: ${event}`);
}

const requiredFiles = ["robots.txt", "sitemap.xml", "partners/thanks/index.html"];
for (const file of requiredFiles) {
  if (!existsSync(resolve(root, file))) failures.push(`Missing release file: ${file}`);
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Partner page checks passed: ${ids.length} ids, ${localRefs.length} local references, ${requiredEvents.length} analytics hooks.`);
}
