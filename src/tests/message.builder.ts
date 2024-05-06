import { Message, MessageText } from "../message";

export const messageBuilder = ({
    id = "message-id",
    text = "hello wrld",
    author = "Alice",
    publishedAt = new Date("2024-04-02T11:15:00.000Z")
}: {
    id?: string;
    text?: string;
    author?: string;
    publishedAt?: Date;
} = {}) => {
    const props = { id, text, author, publishedAt };

    return {
        withId(_id: string) {
            return messageBuilder({
                ...props,
                id: _id
            })
        },
        authoredBy(_author: string) {
            return messageBuilder({
                ...props,
                author: _author
            })
        },
        withText(_text: string) {
            return messageBuilder({
                ...props,
                text: _text
            })
        },
        publishedAt(_publishedAt: Date) {
            return messageBuilder({
                ...props,
                publishedAt: _publishedAt
            })
        },
        build(): Message {
            return Message.fromData({
                id: props.id,
                author: props.author,
                text: props.text,
                publishedAt: props.publishedAt
            })
        }
    }
};
