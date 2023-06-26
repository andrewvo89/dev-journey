import { createDraft, getPartials } from './partial';

import { main as scrape } from './scrape';

export async function main() {
  scrape();
  getPartials();
  createDraft();
}
