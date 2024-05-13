#!/usr/bin/env node

import { Command } from "commander";
import { EditMessageUseCase, EditMessageCommand } from "./src/application/usecases/edit-message.usecase";
import { PostMessageUseCase, PostMessageCommand } from "./src/application/usecases/post-message.usecase";
import { ViewTimelineUseCase } from "./src/application/usecases/view-timeline.usecase";
import { FileSystemMessageRepository } from "./src/infra/message.fs.repository";
import { RealDateProvider } from "./src/infra/real-date-provider";
import { FollowUserCommand, FollowUserUseCase } from "./src/application/usecases/follow-user.usecase";
import { FileSystemFolloweeRepository } from "./src/infra/followee.fs.repository";
import { ViewWallUseCase } from "./src/application/usecases/view-wall.usecase";


const messageRepository = new FileSystemMessageRepository();
const followeeRepository = new FileSystemFolloweeRepository();
const dateProvider = new RealDateProvider();

const postMessageUseCase = new PostMessageUseCase(
    messageRepository,
    dateProvider
);

const editMessageUseCase = new EditMessageUseCase(
    messageRepository
);

const viewTimelineUseCase = new ViewTimelineUseCase(messageRepository, dateProvider);
const viewWallUseCase = new ViewWallUseCase(messageRepository, followeeRepository, dateProvider);

const followUserUseCase = new FollowUserUseCase(followeeRepository);

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

program.command('follow')
    .description('follow command')
    .argument('<user>', 'the follower')
    .argument('<user-to-follow>', 'the user to follow')
    .action(async (user, userToFollow) => {
        const followUserCommand: FollowUserCommand = {
            user: user,
            userToFollow: userToFollow
        }

        try {
            await followUserUseCase.handle(followUserCommand);
            console.log("user followed");
        } catch(error) {
            console.error('follow command error', error);
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

program.command('wall')
    .argument('<user>', 'the user to view the wall of')
    .action(async (user) => {
        try {
            const timeline = await viewWallUseCase.handle(user);
            console.table(timeline);
        } catch(error) {
            console.error('view command error', error);
        }
    });

program.parse();
