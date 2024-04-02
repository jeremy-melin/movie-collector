import { Message } from "./message";

export interface MessageRepository {
    save(message: Message): void;
    getAllMessagesFromAuthor(author: string): Promise<Message[]>;
    getbyId(messageId: string): Promise<Message>;
}