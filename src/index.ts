import * as fs from 'fs';
import chalk from 'chalk';
import minimist from 'minimist';
import { Parser, Selector } from '@/libs/parser';
import pkg from '../package.json';

const argv = minimist(process.argv.slice(2),  {
  default: {
    pages: 62,
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
  process.exit(0);
}

if (argv.help) {
  console.log(chalk.green('Usage examples:'));
  console.log(chalk.green('    toster-tags-parser -v[--version]     Print package version'));
  console.log(chalk.green('    toster-tags-parser -h[--help]        Print this message'));
  console.log(chalk.green('    toster-tags-parser -p[--pages] 62    Total pages'));
  console.log(chalk.green('    toster-tags-parser -c[--output]      Output file path'));
  process.exit(0);
}

if (!argv.output) {
  console.log(chalk.red('File path not passed'));
  process.exit(1);
}

export class TagsParser extends Parser {
  async run(selector: Selector, totalPages = 1) {
    await super.run(selector, totalPages);

    await this.start();

    const promises: Promise<Tag[]>[] = [];

    for (let i = 1; i <= totalPages; i++) {
      promises.push(
        this.browser.newPage().then(
          async (page): Promise<Tag[]> => {
            await page.goto(`${this.url}${i}`, { timeout: 100000 });

            return page.$$eval(selector, (elements): Tag[] => {
              return Array.from(elements).map(
                (element): Tag => {
                  const image = <HTMLImageElement>(element.querySelector('img.tag__image'));
                  const link = <HTMLAnchorElement>(element.querySelector('.card__head-title a'));
                  const defaultImageUrl = 'https://hsto.org/webt/qd/le/pv/qdlepv7-2c56wz5_jpd0tkciu-w.png';

                  return <Tag>{
                    name: link.innerText
                      ? link.innerText.trim()
                      : '',
                    slug: link.getAttribute('title'),
                    image: image
                      ? image
                        .getAttribute('src')
                        .replace(
                          /^https:\/\/habrastorage\.org\//,
                          'https://hsto.org/'
                        )
                      : defaultImageUrl,
                  };
                }
              );
            });
          }
        )
      );
    }

    const pagesData = await this.progressWrapper<Tag[]>(promises);
    const lines = pagesData.reduce((acc: Tag[], items: Tag[]) => acc.concat(items), []);

    this.saveToJSON(lines);

    await this.stop();
  }

  private saveToJSON(tags: Tag[]) {
    console.log(chalk.green('Collected tags: %d'), tags.length);

    if (fs.existsSync(this.filePath)) {
      fs.unlinkSync(this.filePath);
    }

    const writeStream = fs.createWriteStream(this.filePath, { flags: 'w+' });

    writeStream.write(JSON.stringify(tags, null, 2));
  }
}

const parser = new TagsParser('/tags?page=', argv.output);
const pages = Number(argv.pages) || 62;

parser.run('header.card__head', pages);

export interface Tag {
  name: string;
  slug: string;
  image: string;
}
