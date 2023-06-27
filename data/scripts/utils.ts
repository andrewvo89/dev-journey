import { Resource } from '../../types/jnode';
import dayjs from 'dayjs';
import fs from 'fs';
import { jnodesMapSchema } from '../../schemas/jnode';
import path from 'path';
import { produce } from 'immer';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

export async function printDomainCounts() {
  const jsonFiles = fs
    .readdirSync(path.join(__dirname, '..', 'jnodes'))
    .filter((f) => fs.statSync(path.join(__dirname, '..', 'jnodes', f)).isFile() && f.endsWith('.json'));
  const jnodesMapList = jsonFiles.map((jsonFile) => {
    const prevJSONStr = fs.readFileSync(path.join(__dirname, '..', 'jnodes', jsonFile), 'utf-8');
    return jnodesMapSchema.parse(JSON.parse(prevJSONStr));
  });
  const counts = jnodesMapList.reduce<Record<string, number>>(
    (counts, jnodesMap) =>
      produce(counts, (draft) => {
        for (const jnode of Object.values(jnodesMap)) {
          const resources = Object.values(jnode.resources).flat();
          for (const resource of resources) {
            const domain = new URL(resource.url).hostname;
            draft[domain] = (draft[domain] ?? 0) + 1;
          }
        }
      }),
    {},
  );
  const sortedCounts = produce(counts, (draft) =>
    Object.entries(draft)
      .sort((a, b) => b[1] - a[1])
      .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {}),
  );
  console.info(sortedCounts);
}

export function isResourcePartial(resource: Resource): boolean {
  switch (resource.type) {
    case 'article':
      return resource.authors.length === 0 || resource.title.length === 0;
    case 'book':
      return resource.authors.length === 0 || resource.title.length === 0 || resource.pages === 0;
    case 'course': {
      const { authors, title, platform } = resource;
      return [authors.length, title.length, platform.length].some((l) => l === 0);
    }
    case 'documentation':
      return resource.title.length === 0;
    case 'video':
      return resource.authors.length === 0 || resource.title.length === 0 || resource.duration === 0;
    default:
      return true;
  }
}
