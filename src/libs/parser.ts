import * as path from 'path';
import chalk from 'chalk';
import mkdir from 'mkdirp-sync';
import * as puppeteer from 'puppeteer';
import { Bar as ProgressBar } from 'cli-progress';

export function buildFilePath (...args: string[]): string {
  return path.resolve(process.cwd(), ...args);
}

export type Selector = string;

export class Parser {
  protected browser: puppeteer.Browser = null;
  protected readonly baseUrl: string = 'https://qna.habr.com';
  protected readonly progress: ProgressBar = new ProgressBar({
    barCompleteChar: '#',
    barIncompleteChar: '.',
    stopOnComplete: true,
  });

  constructor (protected url: string, protected filePath: string) {
    this.url = new URL(url, this.baseUrl).toString();
    this.filePath = buildFilePath(filePath);

    const dirName = path.dirname(this.filePath);

    try {
      mkdir(dirName);
    } catch {
      console.log(chalk.red(`Failed to create directory "${dirName}"!`));
      process.exit(1);
    }
  }

  public async run (selector: Selector, totalPages?: number): Promise<void> {
    console.log(chalk.green('Selector: %s, Total pages: %d'), selector, totalPages);
  }

  protected async start (): Promise<void> {
    this.browser = await puppeteer.launch();
  }

  protected async stop (): Promise<void> {
    await this.browser.close();
  }

  protected progressWrapper<T = any> (promises: Promise<T>[]): Promise<T[]> {
    const total = promises.length;
    let d = 0;

    this.progress.start(100, 0);

    promises.forEach((p: Promise<T>) => {
      p.then(() => {
        d++;
        const percentage = (d * 100) / total;
        this.progress.update(parseInt(String(percentage), 10));
      });
    });

    return Promise.all(promises);
  }
}
