import { Timeline } from "../../domain/timeline";
import { DateProvider } from "../date-provider";
import { MessageRepository } from "../message.repository";

export class ViewTimelineUseCase {

    constructor(
        private readonly messageRepository: MessageRepository,
        private readonly dateProvider: DateProvider
        ) {}

    async handle(author: string): Promise<
        {
            text: string,
            author: string,
            publicationTime: string
        }[]
    > {
        const messages = await this.messageRepository.getAllMessagesFromAuthor(author);
        const timeline = new Timeline(messages, this.dateProvider.getNow());
        return timeline.data;
    }
}
