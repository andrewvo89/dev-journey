const filename = 'libraries.json';

const databases = require(`./${filename}`);

const fs = require('fs');
const path = require('path');

const transformed = JSON.stringify(
  Object.entries(databases).reduce(
    (acc, [key, { attributes, ...rest }]) => ({
      ...acc,
      [key]: rest,
    }),
    {},
  ),
);

fs.writeFileSync(path.join(__dirname, filename), transformed);
