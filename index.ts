#!/usr/bin/env node

import { Command } from "commander";
import { DateProvider, PostMessageCommand, PostMessageUseCase } from "./src/post-message.usecase";
import { FileSystemMessageRepository } from "./src/message.fs.repository";

class RealDateProvider implements DateProvider {
    getNow(): Date {
        return new Date();
    }
}

const messageRepository = new FileSystemMessageRepository();
const dateProvider = new RealDateProvider();

const postMessageUseCase = new PostMessageUseCase(
    messageRepository,
    dateProvider
);

const program = new Command();
program
  .name('Movie collector')
  .description('Actually just a command prompt for crafty social network')
  .version('0.0.1');

program.command('message')
    .description('message command')
    .argument('<user>', 'the message author')
    .argument('<message>', 'the message to post')
    .action(async (user, message) => {
        const postMessageCommand: PostMessageCommand = {
            id: "message-id",
            author: user,
            text: message
        }

        try {
            await postMessageUseCase.handle(postMessageCommand);
            console.log("message posted");
        } catch(error) {
            console.error('post command error', error);
        }
    });

program.parse();
