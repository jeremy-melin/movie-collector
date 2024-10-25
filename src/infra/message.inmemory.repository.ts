import { Message } from "./../domain/message";
import { MessageRepository } from "./../application/message.repository";

export class InMemoryMessageRepository implements MessageRepository {
    messages = new Map<string, Message>();
    save(msg: Message): Promise<void> {
        this._save(msg);

        return Promise.resolve();
    }

    getbyId(messageId: string): Promise<Message> {
        return Promise.resolve(this.getMessageById(messageId));
    }

    getMessageById(id: string) {
        return this.messages.get(id)!;
    }

    givenExistingMessages(messages: Message[]) {
        messages.forEach(this._save.bind(this));
    }

    getAllMessagesFromAuthor(author: string): Promise<Message[]> {
        const msgs = [...this.messages.values()].filter(msg => msg.author === author);
        return Promise.resolve(msgs);
    }

    private _save(msg: Message) {
        this.messages.set(msg.id, msg);
    }
}