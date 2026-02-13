import { metadataRegistry } from "../src/lib/metadata-registry";

function fail(message: string): never {
  console.error(`\n[metadata-validator] ${message}`);
  process.exit(1);
}

const titleMap = new Map<string, string>();
const descriptionMap = new Map<string, string>();
const pathMap = new Set<string>();

for (const entry of metadataRegistry) {
  if (pathMap.has(entry.path)) {
    fail(`Duplicate path detected: ${entry.path}`);
  }
  pathMap.add(entry.path);

  if (entry.title.length > 60) {
    fail(`Title over 60 characters for ${entry.path}: "${entry.title}" (${entry.title.length})`);
  }

  if (entry.description.length !== 160) {
    fail(`Description must be exactly 160 characters for ${entry.path}. Current length: ${entry.description.length}`);
  }

  const existingTitlePath = titleMap.get(entry.title);
  if (existingTitlePath) {
    fail(`Duplicate title found for ${entry.path} and ${existingTitlePath}: "${entry.title}"`);
  }
  titleMap.set(entry.title, entry.path);

  const existingDescriptionPath = descriptionMap.get(entry.description);
  if (existingDescriptionPath) {
    fail(`Duplicate description found for ${entry.path} and ${existingDescriptionPath}.`);
  }
  descriptionMap.set(entry.description, entry.path);
}

if (metadataRegistry.length < 70) {
  fail(`Expected a large metadata registry; found only ${metadataRegistry.length} routes.`);
}

console.info(`[metadata-validator] OK (${metadataRegistry.length} routes validated)`);
