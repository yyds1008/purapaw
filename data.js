// data.js - JSON file-backed store with simple API.
const fs = require('fs');
const path = require('path');
const DB_FILE = path.join(__dirname, 'data', 'site.json');

function load() {
  const raw = fs.readFileSync(DB_FILE, 'utf8');
  return JSON.parse(raw);
}

function save(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

module.exports = {
  get: function () { return load(); },
  save: function (data) { save(data); },
  read: function () { return load(); },
  write: function (mutator) {
    const data = load();
    mutator(data);
    save(data);
  }
};
