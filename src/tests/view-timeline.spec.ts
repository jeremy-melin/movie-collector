import { Message } from "../message";
import { InMemoryMessageRepository } from "../message.inmemory.repository";
import { DateProvider } from "../post-message.usecase";
import { ViewTimeimelineUseCase } from "../view-timeline.usecase";

describe('Feature: view a message timeline', () => {
    let fixture: Fixture;

    beforeEach(async () => {
        fixture = createFixture();
    });
    
    describe('Rule: messages are shown in reverse chronological order', () => {
        test("alice can see her 2 messages in correct order", async () => {
            fixture.givenTheFollowingMessagesExists([
                {
                    id: "message-1",
                    text: "Hello world !",
                    author: "Alice",
                    publishedAt: new Date("2023-01-19T19:00:00.000Z")
                },
                {
                    id: "message-2",
                    text: "this is my hole it was made for me",
                    author: "the Rabbit",
                    publishedAt: new Date("2023-01-19T20:00:00.000Z")
                },
                {                
                    id: "message-3",
                    text: "uuuh okay",
                    author: "Alice",
                    publishedAt: new Date("2023-01-19T21:00:00.000Z")
                }
            ]);

            fixture.givenNowIs(new Date("2023-01-19T22:00:00.000Z"));

            await fixture.whenUserSeesTimelineOf("Alice");

            fixture.thenUserShouldSee([
                {
                    text: "uuuh okay",
                    author: "Alice",
                    publicationTime: "one hour ago"
                },
                {
                    text: "Hello world !",
                    author: "Alice",
                    publicationTime: "two hours ago"
                }
            ]);
        });
    });
});

type Timeline = {
    text: string,
    author: string,
    publicationTime: string
}[];


class StubDateProvider implements DateProvider {
    now: Date;
    getNow(): Date {
        return this.now;
    }
}

const createFixture = () => {

    const messageRepository = new InMemoryMessageRepository();
    const dateProvider = new StubDateProvider();
    const viewTimelineUseCase = new ViewTimeimelineUseCase(messageRepository);

    let expectedTimeline: Timeline = [];
    let thrownError: Error;

    return {
        givenTheFollowingMessagesExists(messages: Message[]) {
            messageRepository.givenExistingMessages(messages);
        },
        givenNowIs(now: Date) {
            dateProvider.now = now;
        },
        async whenUserSeesTimelineOf(author: string) {
            try {
                expectedTimeline = await viewTimelineUseCase.handle({author});
            } catch (error) {
                thrownError = error;
            }
        },
        thenUserShouldSee(timeline: Timeline) {
            expect(timeline).toEqual(expectedTimeline);
        }
    }

};

type Fixture = ReturnType<typeof createFixture>;
