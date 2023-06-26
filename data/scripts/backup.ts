import 'dotenv/config';

import { JnodesMap } from '../../types/jnode';
import assert from 'assert';
import dayjs from 'dayjs';
import fs from 'fs';
import { jnodesMapSchema } from '../../schemas/jnode';
import path from 'path';
import { produce } from 'immer';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

export function main() {
  const jsonFiles = fs
    .readdirSync(path.join(__dirname, '..', 'jnodes'))
    .filter((f) => fs.statSync(path.join(__dirname, '..', 'jnodes', f)).isFile() && f.endsWith('.json'));

  const backupFolder = dayjs().tz(process.env.TIMEZONE).format('YYYY-MM-DDTHH:mm:ssZ[Z]');

  for (const jsonFilename of jsonFiles) {
    const json = readJnodesMap(jsonFilename);
    const latestBackup = findLatestBackup(jsonFilename);

    if (!latestBackup) {
      writeBackup(jsonFilename, json, backupFolder);
      continue;
    }

    if (!isJnodesMapsSame(json, latestBackup)) {
      writeBackup(jsonFilename, json, backupFolder);
    }
  }
}

function writeBackup(filename: string, json: JnodesMap, backupFolder: string) {
  const backupFolderPath = path.join(__dirname, '..', 'jnodes', 'backups', backupFolder);
  fs.mkdirSync(backupFolderPath, { recursive: true });
  fs.writeFileSync(path.join(backupFolderPath, filename), JSON.stringify(json, null, 2));
}

function readJnodesMap(filename: string): JnodesMap {
  const jsonStr = fs.readFileSync(path.join(__dirname, '..', 'jnodes', filename), 'utf-8');
  return jnodesMapSchema.parse(JSON.parse(jsonStr));
}

function findLatestBackup(filename: string): JnodesMap | null {
  const currentBackupFolders = fs
    .readdirSync(path.join(__dirname, '..', 'jnodes', 'backups'))
    .filter((f) => fs.statSync(path.join(__dirname, '..', 'jnodes', 'backups', f)).isDirectory());

  if (currentBackupFolders.length === 0) {
    return null;
  }

  return produce(currentBackupFolders, (draft) => draft.sort().reverse()).reduce<JnodesMap | null>((file, folder) => {
    if (file !== null) {
      return file;
    }
    const backupFile = fs
      .readdirSync(path.join(__dirname, '..', 'jnodes', 'backups', folder))
      .find((f) => fs.statSync(path.join(__dirname, '..', 'jnodes', f)).isFile() && f === filename);

    if (!backupFile) {
      return null;
    }

    const jsonStr = fs.readFileSync(path.join(__dirname, '..', 'jnodes', 'backups', folder, backupFile), 'utf-8');
    return jnodesMapSchema.parse(JSON.parse(jsonStr));
  }, null);
}

function isJnodesMapsSame(a: JnodesMap, b: JnodesMap): boolean {
  try {
    assert.deepEqual(a, b);
    return true;
  } catch {
    return false;
  }
}
