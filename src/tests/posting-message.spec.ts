import { DateProvider, Message, MessageRepository, PostMessageCommand, PostMessageUseCase } from "../post-message.usecase";

describe("Feature: Posting a message", () => {
    describe("Rule: A message can contain a maximum of 280 characters", () => {
        test("Alice can post a message on her timeline", async() => {
            givenNowIs(new Date("2023-01-19T19:00:00.000Z"));

            whenUserPostsAMessage({
                id: "message-id",
                text: "Hello wolrd !",
                author: "Alice"
            });

            thenPostedMessageShouldBe({
                id: "message-id",
                text: "Hello wolrd !",
                author: "Alice",
                publishedAt: new Date("2023-01-19T19:00:00.000Z")
            })
        });
    });
});


let message: Message;

class InMemoryMessageRepository implements MessageRepository {
    save(msg: Message): void {
        message = msg;
    }
}

class StubDateProvider implements DateProvider {
    now: Date;
    getNow(): Date {
        return this.now;
    }
}

const messageRepository = new InMemoryMessageRepository();
const dateProvider = new StubDateProvider();

const postMessageUseCase = new PostMessageUseCase(
    messageRepository,
    dateProvider
);

function givenNowIs(_now: Date) {
    dateProvider.now = _now;
}

function whenUserPostsAMessage(postMessageCommand: PostMessageCommand) {
    postMessageUseCase.handle(postMessageCommand);
}

function thenPostedMessageShouldBe(expectedMessage: Message) {
    expect(expectedMessage).toEqual({
        id: "message-id",
        text: "Hello wolrd !",
        author: "Alice",
        publishedAt: new Date("2023-01-19T19:00:00.000Z")
    });
}
