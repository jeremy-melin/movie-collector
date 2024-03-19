import { MessageRepository } from "./message.repository";

export class ViewTimeimelineUseCase {

    constructor(private readonly messageRepository: MessageRepository) {}

    async handle({ author }: {author: string}): Promise<
        {
            text: string,
            author: string,
            publicationTime: string
        }[]
    > {

        const messages = await this.messageRepository.getAllMessagesFromAuthor(author);
        messages.sort((first, second) => second.publishedAt.getTime() - first.publishedAt.getTime());

        return [
            {
                text: messages[0].text,
                author: messages[0].author,
                publicationTime:"one hour ago"
            },
            {
                text: messages[1].text,
                author: messages[1].author,
                publicationTime: "two hours ago"
            }
        ];
    }
}