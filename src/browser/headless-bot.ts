import { HeadlessBotOptions } from './options';

export interface HeadlessBot {
    // hui
}

export interface HeadlessBotImpl {
    new (options: HeadlessBotOptions): HeadlessBot;
}