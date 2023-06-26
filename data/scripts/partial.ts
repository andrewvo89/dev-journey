import { JnodesMap, PartialResources, PartialResourcesMap, Resource, ResourceType } from '../../types/jnode';
import { jnodesMapSchema, partialResourcesSchema, resourceSchema } from '../../schemas/jnode';

import assert from 'assert';
import { main as backup } from './backup';
import dayjs from 'dayjs';
import fs from 'fs';
import { isResourcePartial } from './utils';
import path from 'path';
import { produce } from 'immer';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

const types: ResourceType[] = ['article', 'book', 'course', 'documentation', 'video'];

const emptyResources: PartialResources = { resources: [], total: 0 };

const emptyPartialResourcesMap: PartialResourcesMap = {
  article: emptyResources,
  book: emptyResources,
  course: emptyResources,
  documentation: emptyResources,
  video: emptyResources,
};

export function getPartials() {
  const partialFolder = dayjs().tz(process.env.TIMEZONE).format('YYYY-MM-DDTHH:mm:ssZ[Z]');
  const jsonFiles = fs
    .readdirSync(path.join(__dirname, '..', 'jnodes'))
    .filter((f) => fs.statSync(path.join(__dirname, '..', 'jnodes', f)).isFile() && f.endsWith('.json'));

  const jnodesMapList = jsonFiles.map((jsonFile) => {
    const prevJSONStr = fs.readFileSync(path.join(__dirname, '..', 'jnodes', jsonFile), 'utf-8');
    return jnodesMapSchema.parse(JSON.parse(prevJSONStr));
  });

  const partialResourceMap = getPartialResourcesMap(jnodesMapList);

  for (const [key, json] of Object.entries(partialResourceMap)) {
    const latestPartial = findLatestPartial(`${key}.json`);

    if (!latestPartial) {
      writePartial(`${key}.json`, json, partialFolder);
      continue;
    }

    if (!isPartialsMapSame(json, latestPartial)) {
      writePartial(`${key}.json`, json, partialFolder);
    }
  }
}

export function createDraft() {
  for (const type of types) {
    const latestPartial = findLatestPartial(`${type}.json`);
    if (latestPartial) {
      writePartial(`${type}.json`, latestPartial, 'draft');
    } else {
      writePartial(`${type}.json`, emptyResources, 'draft');
    }
  }
}

export function mergeDraft() {
  backup();
  const resources = getDraftResources();
  console.info(`Found ${resources.length} resources in draft`);
  const completeResources = resources.filter((r) => !isResourcePartial(r));
  console.info(`Found ${completeResources.length} complete resources in draft`);

  const jsonFiles = fs
    .readdirSync(path.join(__dirname, '..', 'jnodes'))
    .filter((f) => fs.statSync(path.join(__dirname, '..', 'jnodes', f)).isFile() && f.endsWith('.json'));

  for (const jsonFile of jsonFiles) {
    const jsonStr = fs.readFileSync(path.join(__dirname, '..', 'jnodes', jsonFile), 'utf-8');
    const json = jnodesMapSchema.parse(JSON.parse(jsonStr));
    const { jnodesMap: newJSON } = mergeJnodes(completeResources, json);
    fs.writeFileSync(path.join(__dirname, '..', 'jnodes', jsonFile), JSON.stringify(newJSON, null, 2));
  }

  getPartials();
  createDraft();
}

function getDraftResources(): Resource[] {
  const draftFolderPath = path.join(__dirname, '..', 'jnodes', 'partials', 'draft');
  const draftFiles = fs
    .readdirSync(draftFolderPath)
    .filter(
      (f) =>
        fs.statSync(path.join(draftFolderPath, f)).isFile() &&
        f.endsWith('.json') &&
        types.some((type) => type === f.split('.json')[0]),
    );
  return draftFiles.flatMap((file) => {
    const jsonStr = fs.readFileSync(path.join(draftFolderPath, file), 'utf-8');
    const json = partialResourcesSchema.parse(JSON.parse(jsonStr));
    return json.resources;
  });
}

function writePartial(filename: string, json: PartialResources, partialFolder: string) {
  const partialFolderPath = path.join(__dirname, '..', 'jnodes', 'partials', partialFolder);
  fs.mkdirSync(partialFolderPath, { recursive: true });
  fs.writeFileSync(path.join(partialFolderPath, filename), JSON.stringify(json, null, 2));
}

function getPartialResourcesMap(jnodesMapList: JnodesMap[]): PartialResourcesMap;
function getPartialResourcesMap(resources: Resource[]): PartialResourcesMap;

function getPartialResourcesMap(input: unknown): PartialResourcesMap {
  const isResources = resourceSchema.array().safeParse(input);
  if (isResources.success) {
    const resources = isResources.data;
    return resources.reduce<PartialResourcesMap>(
      (list, resource) =>
        produce(list, (draft) => {
          if (!isResourcePartial(resource)) {
            return;
          }
          const exists = draft[resource.type].resources.find((r) => r.url === resource.url);
          if (exists) {
            return;
          }
          draft[resource.type].resources.push(resource);
          draft[resource.type].total += 1;
        }),
      emptyPartialResourcesMap,
    );
  }

  const isJnodesMapList = jnodesMapSchema.array().safeParse(input);
  if (isJnodesMapList.success) {
    const jnodesMapList = isJnodesMapList.data;
    return jnodesMapList.reduce<PartialResourcesMap>(
      (list, jnodesMap) =>
        produce(list, (draft) => {
          for (const jnode of Object.values(jnodesMap)) {
            for (const resource of Object.values(jnode.resources).flat()) {
              if (!isResourcePartial(resource)) {
                continue;
              }
              const exists = draft[resource.type].resources.find((r) => r.url === resource.url);
              if (exists) {
                continue;
              }
              draft[resource.type].resources.push(resource);
              draft[resource.type].total += 1;
            }
          }
        }),
      emptyPartialResourcesMap,
    );
  }

  throw new Error('Invalid input');
}

function findLatestPartial(filename: string): PartialResources | null {
  const currentPartialFolders = fs
    .readdirSync(path.join(__dirname, '..', 'jnodes', 'partials'))
    .filter((f) => fs.statSync(path.join(__dirname, '..', 'jnodes', 'partials', f)).isDirectory() && f !== 'draft');

  if (currentPartialFolders.length === 0) {
    return null;
  }

  return produce(currentPartialFolders, (draft) => draft.sort().reverse()).reduce<PartialResources | null>(
    (file, folder) => {
      if (file !== null) {
        return file;
      }
      const basePath = path.join(__dirname, '..', 'jnodes', 'partials', folder);
      const partialFile = fs
        .readdirSync(basePath)
        .find((f) => fs.statSync(path.join(basePath, f)).isFile() && f === filename);

      if (!partialFile) {
        return null;
      }

      const jsonStr = fs.readFileSync(path.join(__dirname, '..', 'jnodes', 'partials', folder, partialFile), 'utf-8');
      return partialResourcesSchema.parse(JSON.parse(jsonStr));
    },
    null,
  );
}

function isPartialsMapSame(a: PartialResources, b: PartialResources): boolean {
  try {
    assert.deepEqual(a, b);
    return true;
  } catch {
    return false;
  }
}

function mergeJnodes(resources: Resource[], jnodesMap: JnodesMap): { merged: Resource[]; jnodesMap: JnodesMap } {
  return resources.reduce<{ merged: Resource[]; jnodesMap: JnodesMap }>(
    (map, resource) =>
      produce(map, (draft) => {
        for (const [key, jnode] of Object.entries(draft.jnodesMap)) {
          switch (resource.type) {
            case 'article': {
              const foundIndex = jnode.resources.articles.findIndex((r) => r.url === resource.url);
              if (foundIndex !== -1 && isResourcePartial(jnode.resources.articles[foundIndex])) {
                jnode.resources.articles[foundIndex] = resource;
                draft.merged.push(resource);
                console.info(`Merging in article to ${key}: ${resource.url}`);
              }
              break;
            }
            case 'book': {
              const foundIndex = jnode.resources.books.findIndex((r) => r.url === resource.url);
              if (foundIndex !== -1 && isResourcePartial(jnode.resources.books[foundIndex])) {
                jnode.resources.books[foundIndex] = resource;
                draft.merged.push(resource);
                console.info(`Merging in book to ${key}: ${resource.url}`);
              }
              break;
            }
            case 'course': {
              const foundIndex = jnode.resources.courses.findIndex((r) => r.url === resource.url);
              if (foundIndex !== -1 && isResourcePartial(jnode.resources.courses[foundIndex])) {
                jnode.resources.courses[foundIndex] = resource;
                draft.merged.push(resource);
                console.info(`Merging in course to ${key}: ${resource.url}`);
              }
              break;
            }
            case 'documentation': {
              const foundIndex = jnode.resources.documentation.findIndex((r) => r.url === resource.url);
              if (foundIndex !== -1 && isResourcePartial(jnode.resources.documentation[foundIndex])) {
                jnode.resources.documentation[foundIndex] = resource;
                draft.merged.push(resource);
                console.info(`Merging in documentation to ${key}: ${resource.url}`);
              }
              break;
            }
            case 'video': {
              const foundIndex = jnode.resources.videos.findIndex((r) => r.url === resource.url);
              if (foundIndex !== -1 && isResourcePartial(jnode.resources.videos[foundIndex])) {
                jnode.resources.videos[foundIndex] = resource;
                draft.merged.push(resource);
                console.info(`Merging in video to ${key}: ${resource.url}`);
              }
              break;
            }
          }
        }
      }),
    { merged: [], jnodesMap },
  );
}
