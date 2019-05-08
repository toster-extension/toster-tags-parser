const fs = require('fs');
const shell = require('shelljs');
const errcodes = require('./errcodes');

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

        it('DIST_FILE_IS_EMPTY', () => {
            const { code } = shell.exec(
                './bin/toster-tags-parser'
            );
            expect(code).toEqual(errcodes.DIST_FILE_IS_EMPTY);
        });

        it('FAILED_CREATE_DIRECTORY', () => {
            const { code } = shell.exec(
                './bin/toster-tags-parser --output /etc/qwerty/assets/tags.json'
            );
            expect(code).toEqual(errcodes.FAILED_CREATE_DIRECTORY);
        });
    });

    describe('Parse tags', () => {
        beforeEach(clearDist);

        afterEach(clearDist);

        it('with params "--pages 1" and "--output ./assets.tags.json"', () => {
            const { code } = shell.exec('./bin/toster-tags-parser --pages 1 --output ./assets/tags.json');
            expect(code).toEqual(errcodes.OK);
        });
    });
});
