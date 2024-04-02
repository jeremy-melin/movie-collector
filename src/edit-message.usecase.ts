import { MessageText } from "./message";
import { MessageRepository } from "./message.repository";

export type EditMessageCommand = {
    id: string;
    text: string;
}

export class EditMessageUseCase {
    
    constructor(private readonly messageRepository: MessageRepository) {}

    async handle(editMessageCommand: EditMessageCommand) {

        const message = await this.messageRepository.getbyId(editMessageCommand.id);
        const editedMessage = {
            ...message,
            text: MessageText.of(editMessageCommand.text)
        };

        await this.messageRepository.save(editedMessage);
    }
}
