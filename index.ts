#!/usr/bin/env node

import { Command } from "commander";
import { DateProvider, PostMessageCommand, PostMessageUseCase } from "./src/post-message.usecase";
import { FileSystemMessageRepository } from "./src/message.fs.repository";
import { ViewTimelineUseCase } from "./src/view-timeline.usecase";
import { EditMessageCommand, EditMessageUseCase } from "./src/edit-message.usecase";

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

const editMessageUseCase = new EditMessageUseCase(
    messageRepository
);

const viewTimelineUseCase = new ViewTimelineUseCase(messageRepository, dateProvider);

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

program.command('edit')
    .description('edit a message')
    .argument('<id>', 'the message id')
    .argument('<message>', 'the message to post')
    .action(async (id, message) => {
        const editMessageCommand: EditMessageCommand = {
            id,
            text: message
        }

        try {
            await editMessageUseCase.handle(editMessageCommand);
            console.log("message posted");
        } catch(error) {
            console.error('post command error', error);
        }
    });

program.command('view')
    .description('view timeline command')
    .argument('<user>', 'the message author')
    .action(async (user) => {
        try {
            const timeline = await viewTimelineUseCase.handle(user);
            console.table(timeline);
        } catch(error) {
            console.error('view command error', error);
        }
    });

program.parse();
