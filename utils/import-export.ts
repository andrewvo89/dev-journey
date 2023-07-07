import { ImportFile, ImportType } from 'types/import-export';

export const importTypes: ImportType[] = ['bookmarks', 'history', 'filters', 'sort', 'viewport'];

export function getPrettyType(type: ImportType) {
  switch (type) {
    case 'bookmarks':
      return 'Bookmarks';
    case 'history':
      return 'History';
    case 'filters':
      return 'Filters';
    case 'sort':
      return 'Sort';
    case 'viewport':
      return 'Viewport';
  }
}

export function createExportJSON(file: ImportFile): string {
  return `data:text/json;chatset=utf-8,${encodeURIComponent(JSON.stringify(file, null, 2))}`;
}
