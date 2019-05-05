import * as fs from 'fs';
import minimist from 'minimist';
import { Parser, Selector } from '@/libs/parser';
import { Tag, TagId } from '@/libs/types';

const argv = minimist(process.argv.slice(2), {
    default: {
        pages: 62,
        output: null,
    },
    string: ['pages', 'output'],
    alias: {
        p: 'pages',
        o: 'output',
    },
});

if (!argv.output) {
    console.error('Не передан путь к файлу');
    process.exit(1);
}

export class TagsParser extends Parser {
    async run (selector: Selector, totalPages: number = 1) {
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
                                            name: link.innerText,
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
        console.log('Собрано тегов:', lines.length);
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
const pages = Number(argv.pages) || 62;

parser.run('header.card__head', pages);
