import * as fs from 'fs';
import chalk from 'chalk';
import minimist from 'minimist';
import { DIST_FILE_IS_EMPTY, OK } from 'bin/errcodes';
import { Parser, Selector } from '@/libs/parser';
import { Tag, TagId } from '@/libs/types';
import pkg from '../package.json';

const argv = minimist(process.argv.slice(2), {
    default: {
        pages: 61,
        output: null,
        help: false,
        version: false,
    },
    string: ['pages', 'output'],
    boolean: ['help', 'version'],
    alias: {
        h: 'help',
        v: 'version',
        p: 'pages',
        o: 'output',
    },
});

if (argv.version) {
    console.log(chalk.green(`v${pkg.version}`));
    process.exit(OK);
}

if (argv.help) {
    console.log(chalk.green('Usage examples:'));
    console.log(
        chalk.green(
            '    toster-tags-parser -v[--version]     Print package version'
        )
    );
    console.log(
        chalk.green(
            '    toster-tags-parser -h[--help]        Print this message'
        )
    );
    console.log(
        chalk.green('    toster-tags-parser -p[--pages] 61    Total pages')
    );
    console.log(
        chalk.green(
            '    toster-tags-parser -c[--output]      Output file path'
        )
    );
    process.exit(OK);
}

if (!argv.output) {
    console.log(chalk.red('File path not passed'));
    process.exit(DIST_FILE_IS_EMPTY);
}

export class TagsParser extends Parser {
    async run (selector: Selector, totalPages: number = 1) {
        await super.run(selector, totalPages);

        await this.start();

        const promises: Promise<Tag[]>[] = [];

        for (let i = 1; i <= totalPages; i++) {
            promises.push(
                this.browser.newPage().then(
                    async (page): Promise<Tag[]> => {
                        await page.goto(`${this.url}${i}`, {
                            timeout: 100000,
                        });

                        return page.$$eval(
                            selector,
                            (elements): Tag[] => {
                                return Array.from(elements).map(
                                    (element): Tag => {
                                        const image = <HTMLImageElement>(
                                            element.querySelector(
                                                'img.tag__image'
                                            )
                                        );
                                        const link = <HTMLAnchorElement>(
                                            element.querySelector(
                                                '.card__head-title a'
                                            )
                                        );

                                        return {
                                            name: link.innerText ? link.innerText.trim() : '',
                                            slug: link.getAttribute('title'),
                                            image: image
                                                ? image.getAttribute('src')
                                                : '',
                                        };
                                    }
                                );
                            }
                        );
                    }
                )
            );
        }

        const pagesData = await this.progressWrapper<Tag[]>(promises);
        const lines = pagesData.reduce((acc: Tag[], item: Tag[]) => [
            ...acc,
            ...item,
        ]);

        this.saveToJSON(lines);

        await this.stop();
    }

    private saveToJSON (lines: Tag[], flags: string = 'w+') {
        console.log(chalk.green('Collected tags: %d'), lines.length);

        if (fs.existsSync(this.filePath)) {
            fs.unlinkSync(this.filePath);
        }

        const logger = fs.createWriteStream(this.filePath, { flags });
        const tagsList: Tag[] = [];

        lines.forEach((tag: Tag, index: number) => {
            tagsList.push({
                id: <TagId>(index + 1),
                ...tag,
            });
        });

        logger.write(JSON.stringify(tagsList, null, 2));
    }
}

const parser = new TagsParser('/tags/?page=', argv.output);
const pages = Number(argv.pages) || 61;

parser.run('header.card__head', pages);
