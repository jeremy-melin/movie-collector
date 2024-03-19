import { Message } from "./message";
import { MessageRepository } from "./message.repository";

export class InMemoryMessageRepository implements MessageRepository {
    messages = new Map<string, Message>();
    save(msg: Message): Promise<void> {
        this._save(msg);

        return Promise.resolve();
    }

    getMessageById(id: string) {
        return this.messages.get(id);
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