import * as path from 'path';
import chalk from 'chalk';
import * as puppeteer from 'puppeteer';
import { Bar as ProgressBar } from 'cli-progress';
import { FAILED_CREATE_DIRECTORY } from 'bin/errcodes';
import { urlGlue } from '@/libs/url-glue';

const mkdir = require('mkdirp-sync');

export function buildFilePath (...args: string[]): string {
    return path.resolve(process.cwd(), ...args);
}

export type Selector = string;

export class Parser {
    protected browser: puppeteer.Browser = null;
    protected readonly baseUrl: string = 'https://toster.ru';
    protected readonly progress: ProgressBar = new ProgressBar({
        barCompleteChar: '#',
        barIncompleteChar: '.',
        stopOnComplete: true,
    });

    constructor (protected url: string, protected filePath: string) {
        this.url = urlGlue(this.baseUrl, url);
        this.filePath = buildFilePath(filePath);

        const dirName = path.dirname(this.filePath);

        try {
            mkdir(dirName);
        } catch {
            console.log(chalk.red(`Failed to create directory "${dirName}"!`));
            process.exit(FAILED_CREATE_DIRECTORY);
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
