import { InMemoryMessageRepository } from "../message.inmemory.repository";
import { DateProvider, EmptyMessageError, Message, MessageRepository, MessageTooLongError, PostMessageCommand, PostMessageUseCase } from "../post-message.usecase";

describe("Feature: Posting a message", () => {

    let fixture: Fixture;

    beforeEach(() => {
        fixture = createFixture();
    });

    describe("Rule: A message can contain a maximum of 280 characters", () => {
        test("Alice can post a message on her timeline", async() => {
            fixture.givenNowIs(new Date("2023-01-19T19:00:00.000Z"));

            await fixture.whenUserPostsAMessage({
                id: "message-id",
                text: "Hello wolrd !",
                author: "Alice"
            });

            fixture.thenPostedMessageShouldBe({
                id: "message-id",
                text: "Hello wolrd !",
                author: "Alice",
                publishedAt: new Date("2023-01-19T19:00:00.000Z")
            })
        });

        test("Alice cannot post a message with more than 280 characters", async () => {
            const messageWith281Characters = "Proin elit justo, condimentum sit amet nunc eu, hendrerit consequat turpis. Praesent pretium sollicitudin nibh, ac egestas sem maximus non. Sed sit amet sagittis orci. Aenean mattis bibendum ligula sit amet commodo. Pellentesque condimentum dui elementum, convallis turpis id eget. ";
            
            fixture.givenNowIs(new Date("2023-01-19T19:00:00.000Z"));
            await fixture.whenUserPostsAMessage({
                id: "message-id",
                text: messageWith281Characters,
                author: "Alice"
            });
            fixture.thenErrorShouldBe(MessageTooLongError);
        })
    });
    describe("Rule: A message cannot be empty", () => {
        test("Alice cannot post an empty message", async () => {
            fixture.givenNowIs(new Date("2023-01-19T19:00:00.000Z"));
            await fixture.whenUserPostsAMessage({
                id: "message-id",
                text: "",
                author: "Alice"
            });
            fixture.thenErrorShouldBe(EmptyMessageError);
        });
        test("Alice cannot post a message with only whitespaces", async () => {
            fixture.givenNowIs(new Date("2023-01-19T19:00:00.000Z"));
            await fixture.whenUserPostsAMessage({
                id: "message-id",
                text: "      ",
                author: "Alice"
            });
            fixture.thenErrorShouldBe(EmptyMessageError);
        });
    });
});

class StubDateProvider implements DateProvider {
    now: Date;
    getNow(): Date {
        return this.now;
    }
}

const createFixture = () => {
    const messageRepository = new InMemoryMessageRepository();
    const dateProvider = new StubDateProvider();
    
    const postMessageUseCase = new PostMessageUseCase(
        messageRepository,
        dateProvider
    );

    let thrownError: Error;

    return {
        givenNowIs(now: Date) {
            dateProvider.now = now;
        },
        async whenUserPostsAMessage(postMessageCommand: PostMessageCommand) {
            try {
                await postMessageUseCase.handle(postMessageCommand);
            } catch (error) {
                thrownError = error;
            }
        },
        thenPostedMessageShouldBe(expectedMessage: Message) {
            expect(expectedMessage).toEqual(messageRepository.message);
        },
        thenErrorShouldBe(expectedErrorClass: new () => Error) {
            expect(thrownError).toBeInstanceOf(expectedErrorClass);
        }
    }
}

type Fixture = ReturnType<typeof createFixture>;
