import * as path from 'path';
import * as fs from 'fs';
import { FileSystemMessageRepository } from '../message.fs.repository';
import { messageBuilder } from './message.builder';

const testMessagePath = path.join(__dirname, 'messages-test.json')

describe('FileSystemMessageRepository', () => {

    beforeEach(async() => {
        await fs.promises.writeFile(testMessagePath, "[]");
    });

    test('save() can save a message in the filesystem', async() => {
        const messageRepository = new FileSystemMessageRepository(testMessagePath);
        const message = messageBuilder()
            .authoredBy("Alice")
            .withText("Hello world !")
            .withId("message-1")
            .publishedAt(new Date("2023-01-19T19:00:00.000Z"))
            .build();

        await messageRepository.save(message);

        const messageData = await fs.promises.readFile(testMessagePath);
        const messageJSON = JSON.parse(messageData.toString());

        expect(messageJSON).toEqual([{
            id: "message-1",
            author: "Alice",
            publishedAt: "2023-01-19T19:00:00.000Z",
            text: "Hello world !"
        }]);
    });

    test('save() can edit a message in the filesystem', async() => {
        const messageRepository = new FileSystemMessageRepository(testMessagePath);
        
        await fs.promises.writeFile(testMessagePath, JSON.stringify([{
            id: "message-1",
            author: "Alice",
            publishedAt: "2023-01-19T19:00:00.000Z",
            text: "Hello world !"
        }]));

        const message = messageBuilder()
            .authoredBy("Alice")
            .withText("Hello world edited !")
            .withId("message-1")
            .publishedAt(new Date("2023-01-19T19:00:00.000Z"))
            .build();

        await messageRepository.save(message);

        const messageData = await fs.promises.readFile(testMessagePath);
        const messageJSON = JSON.parse(messageData.toString());

        expect(messageJSON).toEqual([{
            id: "message-1",
            author: "Alice",
            publishedAt: "2023-01-19T19:00:00.000Z",
            text: "Hello world edited !"
        }]);
    });

    test('getbyId() should find a message by its id', async () => {
        const messageRepository = new FileSystemMessageRepository(testMessagePath);
        
        await fs.promises.writeFile(testMessagePath, JSON.stringify([
            {
                id: "message-1",
                author: "Alice",
                publishedAt: "2023-01-19T19:00:00.000Z",
                text: "Hello world !"
            },
            {
                id: "message-2",
                author: "Bob",
                publishedAt: "2023-01-19T19:00:50.000Z",
                text: "Well hello"
            }
        ]));

        const bobMessage = await messageRepository.getbyId("message-2");

        const expectedMessage = messageBuilder()
            .authoredBy("Bob")
            .withText("Well hello")
            .withId("message-2")
            .publishedAt(new Date("2023-01-19T19:00:50.000Z"))
            .build();

        expect(bobMessage).toEqual(expectedMessage);
   
    });

    test('getAllMessagesFromAuthor() should return all messages by the authors name', async () => {
        const messageRepository = new FileSystemMessageRepository(testMessagePath);
        
        await fs.promises.writeFile(testMessagePath, JSON.stringify([
            {
                id: "message-1",
                author: "Alice",
                publishedAt: "2023-01-19T19:00:00.000Z",
                text: "Hello world !"
            },
            {
                id: "message-2",
                author: "Bob",
                publishedAt: "2023-01-19T19:00:50.000Z",
                text: "Well hello"
            },
            {
                id: "message-3",
                author: "Bob",
                publishedAt: "2023-01-19T19:00:55.000Z",
                text: "have a nice day"
            }
        ]));

        const bobMessages = await messageRepository.getAllMessagesFromAuthor("bob");

        const expectedMessages = [
            messageBuilder()
            .authoredBy("Bob")
            .withText("Well hello")
            .withId("message-2")
            .publishedAt(new Date("2023-01-19T19:00:50.000Z"))
            .build(),
            messageBuilder()
            .authoredBy("Bob")
            .withText("have a nice day")
            .withId("message-3")
            .publishedAt(new Date("2023-01-19T19:00:55.000Z"))
            .build()
        ];

        expect(bobMessages).toHaveLength(2);
        expect(bobMessages).toEqual(expect.arrayContaining(expectedMessages));
   
    });
});