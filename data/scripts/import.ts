import 'dotenv/config';

import { DocumentationResource, JnodesMap, Resource, Resources } from 'types/jnode';
import { scrapeArticle, scrapeBook, scrapeCourse, scrapeVideo } from './scrape';

import dayjs from 'dayjs';
import fs from 'fs';
import { jnodesMapSchema } from '../../schemas/jnode';
import path from 'path';
import { produce } from 'immer';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

async function mergeImports(key: string, imports: string, resources: Resources) {
  const scrapedResources = await Promise.all([
    ...getUrls(imports, 'articles')
      .filter((url) => filterer(url, resources.articles))
      .map(scrapeArticle),
    ...getUrls(imports, 'books')
      .filter((url) => filterer(url, resources.books))
      .map(scrapeBook),
    ...getUrls(imports, 'courses')
      .filter((url) => filterer(url, resources.courses))
      .map(scrapeCourse),
    ...getUrls(imports, 'videos')
      .filter((url) => filterer(url, resources.videos))
      .map(scrapeVideo),
    ...getUrls(imports, 'documentation')
      .filter((url) => filterer(url, resources.documentation))
      .map((url) => Promise.resolve<DocumentationResource>({ authors: [], title: '', type: 'documentation', url })),
  ]);

  const newResources = scrapedResources.filter((r) => r.title.length > 0);
  if (newResources.length > 0) {
    console.info(
      `Imported the following resources for ${key}:`,
      newResources.map((r) => r.url),
    );
  }

  return newResources.reduce<Resources>((prevResources, resource) => {
    switch (resource.type) {
      case 'article': {
        return produce(prevResources, (draft) => {
          const existsIndex = draft.articles.findIndex((a) => a.url === resource.url);
          if (existsIndex > -1) {
            draft.articles.splice(existsIndex, 1, resource);
          } else {
            draft.articles.push(resource);
          }
        });
      }
      case 'book': {
        return produce(prevResources, (draft) => {
          const existsIndex = draft.books.findIndex((a) => a.url === resource.url);
          if (existsIndex > -1) {
            draft.books.splice(existsIndex, 1, resource);
          } else {
            draft.books.push(resource);
          }
        });
      }
      case 'course': {
        return produce(prevResources, (draft) => {
          const existsIndex = draft.courses.findIndex((a) => a.url === resource.url);
          if (existsIndex > -1) {
            draft.courses.splice(existsIndex, 1, resource);
          } else {
            draft.courses.push(resource);
          }
        });
      }
      case 'documentation': {
        return produce(prevResources, (draft) => {
          const existsIndex = draft.documentation.findIndex((a) => a.url === resource.url);
          if (existsIndex > -1) {
            draft.documentation.splice(existsIndex, 1, resource);
          } else {
            draft.documentation.push(resource);
          }
        });
      }
      case 'video': {
        return produce(prevResources, (draft) => {
          const existsIndex = draft.videos.findIndex((a) => a.url === resource.url);
          if (existsIndex > -1) {
            draft.videos.splice(existsIndex, 1, resource);
          } else {
            draft.videos.push(resource);
          }
        });
      }
    }
  }, resources);
}

function getUrls(importContents: string, key: string) {
  return importContents.split(`<${key}>`)[1].split(`<${key}/>`)[0].split('\n').filter(Boolean);
}

function filterer(url: string, resources: Resource[]): boolean {
  const existing = resources.find((a) => a.url === url);
  return !existing || existing.title.length === 0;
}

export async function main() {
  const backupFolder = dayjs().tz(process.env.TIMEZONE).format('YYYY-MM-DDTHH:mm:ssZ[Z]');
  fs.mkdirSync(path.join(__dirname, '..', 'jnodes', 'backups', backupFolder), { recursive: true });

  const folders = fs
    .readdirSync(path.join(__dirname, '..', 'imports'))
    .filter((f) => fs.statSync(path.join(__dirname, '..', 'imports', f)).isDirectory());

  for (const folder of folders) {
    const prevJSONStr = fs.readFileSync(path.join(__dirname, '..', 'jnodes', `${folder}.json`), 'utf-8');
    const prevJSON: JnodesMap = jnodesMapSchema.parse(JSON.parse(prevJSONStr));
    fs.writeFileSync(path.join(__dirname, '..', 'jnodes', 'backups', backupFolder, `${folder}.json`), prevJSONStr);

    const importFiles = fs
      .readdirSync(path.join(__dirname, '..', 'imports', folder))
      .filter((f) => fs.statSync(path.join(__dirname, '..', 'imports', folder, f)).isFile());

    const newResources = await Promise.all(
      importFiles.map((key) => {
        const imports = fs.readFileSync(path.join(__dirname, '..', 'imports', folder, key), 'utf-8');
        return mergeImports(key, imports, prevJSON[key].resources);
      }),
    );
    const newJSON = newResources.reduce((json, resources, index) => {
      const key = importFiles[index];
      return produce(json, (draft) => {
        draft[key].resources = resources;
      });
    }, prevJSON);
    fs.writeFileSync(path.join(__dirname, '..', 'jnodes', `${folder}.json`), JSON.stringify(newJSON, null, 2));
  }
}
