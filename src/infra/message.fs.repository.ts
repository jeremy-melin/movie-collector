import * as path from 'path';
import * as fs from 'fs';
import { Message } from './../domain/message';
import { MessageRepository } from './../application/message.repository';

export class FileSystemMessageRepository implements MessageRepository {

    constructor(
        private readonly messagePath = path.join(__dirname, 'message.json')
    ) {}

    async save(message: Message): Promise<void> {
        const messages = await this.getMessages();
        const existingMessageIndex = messages.findIndex(msg => msg.id === message.id);

        if (existingMessageIndex === -1) {
            messages.push(message);
        } else {
            messages[existingMessageIndex] = message;
        }

        return fs.promises.writeFile(
            this.messagePath,
            JSON.stringify(messages.map(m => m.data))
        );
    }

    async getbyId(messageId: string): Promise<Message> {
        const messages = await this.getMessages();

        return messages.find(msg => msg.id === messageId)!;
    }

    async getAllMessagesFromAuthor(author: string): Promise<Message[]> {
        const messages = await this.getMessages();
        return messages.filter((msg) => 
            msg.author === author
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

        return messages.map(msg => Message.fromData({
            id: msg.id,
            text: msg.text,
            author: msg.author,
            publishedAt: new Date(msg.publishedAt)
        }));
    }
}