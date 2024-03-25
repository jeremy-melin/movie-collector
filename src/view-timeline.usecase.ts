import { MessageRepository } from "./message.repository";
import { DateProvider } from "./post-message.usecase";

const ONE_MINUTE_IN_MS = 60000;

export class ViewTimeimelineUseCase {

    constructor(
        private readonly messageRepository: MessageRepository,
        private readonly dateProvider: DateProvider
        ) {}

    async handle({ author }: {author: string}): Promise<
        {
            text: string,
            author: string,
            publicationTime: string
        }[]
    > {

        const messages = await this.messageRepository.getAllMessagesFromAuthor(author);
        messages.sort((first, second) => second.publishedAt.getTime() - first.publishedAt.getTime());

        return messages.map(msg =>
            ({
                text: msg.text,
                author: msg.author,
                publicationTime: this.publicationTime(msg.publishedAt)
            })
        );
    }

    private publicationTime(publishedAt: Date) {
        const now = this.dateProvider.getNow();
        const diff = now.getTime() - publishedAt.getTime();
        const minutes = Math.floor(diff / ONE_MINUTE_IN_MS);

        if (minutes < 1) {
            return "less than a minute ago";
        }
        if (minutes < 2) {
            return "one minute ago";
        }
        return `${minutes} minutes ago`;
    }
}
