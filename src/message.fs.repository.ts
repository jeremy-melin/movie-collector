import *  as path from 'path';
import * as fs from 'fs';
import { Message } from './message';
import { MessageRepository } from './message.repository';

export class FileSystemMessageRepository implements MessageRepository {

    private readonly messagePath = path.join(__dirname, 'message.json');

    async getAllMessagesFromAuthor(author: string): Promise<Message[]> {
        const messages = await this.getMessages();
        return messages.filter((msg) => 
            msg.author.toLowerCase() === author.toLowerCase()
        );
    }

    async save(message: Message): Promise<void> {
        const messages = await this.getMessages();
        messages.push(message);

        return fs.promises.writeFile(
            this.messagePath,
            JSON.stringify(messages)
        );
    }

    private async getMessages(): Promise<Message[]> {
        const data = await fs.promises.readFile(this.messagePath);
        const messages = JSON.parse(data.toString()) as {
            id: string,
            text: string,
            author: string,
            publishedAt: string
        }[];

        return messages.map(msg => ({
            id: msg.id,
            text: msg.text,
            author: msg.author,
            publishedAt: new Date(msg.publishedAt)
        }));
    }
}