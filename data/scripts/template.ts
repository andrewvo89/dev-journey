import { JNode } from 'types/jnode';
import fs from 'fs';
import path from 'path';

async function run() {
  const jsonFiles = fs
    .readdirSync(path.join(__dirname, '..', 'jnodes'))
    .filter((f) => fs.statSync(path.join(__dirname, '..', 'jnodes', f)).isFile() && f.endsWith('.json'));

  for (const jsonFile of jsonFiles) {
    const folderName = jsonFile.replace('.json', '');
    const folderExists = fs.existsSync(path.join(__dirname, '..', 'imports', folderName));
    if (!folderExists) {
      fs.mkdirSync(path.join(__dirname, '..', 'imports', folderName));
    }

    const existingJson = fs.readFileSync(path.join(__dirname, '..', jsonFile), 'utf-8');
    const json = JSON.parse(existingJson) as Record<string, JNode>;

    for (const key of Object.keys(json)) {
      const fileExists = fs.existsSync(path.join(__dirname, '..', 'imports', folderName, key));
      if (fileExists) {
        continue;
      }
      fs.cpSync(
        path.join(__dirname, '..', 'imports', 'template'),
        path.join(__dirname, '..', 'imports', folderName, key),
      );
    }
  }
}

run();
