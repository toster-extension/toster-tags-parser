/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require('fs');
const shell = require('shelljs');

shell.config.reset();
shell.config.verbose = false;
shell.config.silent = true;

function clearDist () {
  shell.rm('-rf', './assets');
}

describe('Toster tags parser', () => {
  beforeAll(clearDist);

  afterAll(clearDist);

  describe('Test errors', () => {
    beforeEach(clearDist);

    afterEach(clearDist);

    it('file path not passed', () => {
      const { code } = shell.exec('./bin/toster-tags-parser');
      expect(code).toEqual(1);
    });
  });

  describe('Parse tags', () => {
    beforeEach(clearDist);

    afterEach(clearDist);

    it('with params "--pages 1" and "--output ./assets.tags.json"', () => {
      const { code } = shell.exec('./bin/toster-tags-parser --pages 1 --output ./assets/tags.json');
      expect(code).toEqual(0);
    });

    it('image domain "habrastorage.org" replaced to "hsto.org"', () => {
      const { code } = shell.exec('./bin/toster-tags-parser --pages 1 --output ./assets/tags.json');
      expect(code).toEqual(0);
      const json = fs.readFileSync('./assets/tags.json');
      const domains = JSON.parse(json).map(tag => tag.image);
      const includeOldDomain = domains.filter(domain => domain.startsWith('https://habrastorage.org'));
      const includeNewDomain = domains.filter(domain => domain.startsWith('https://hsto.org'));
      expect(includeOldDomain.length).toEqual(0);
      expect(includeNewDomain.length).toEqual(domains.length);
    });
  });
});
