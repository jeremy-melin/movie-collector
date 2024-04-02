import { messageBuilder } from "./message.builder";
import { MessagingFixture, createMessagingFixture } from "./messaging.fixture";


describe('Feature: view a message timeline', () => {
    let fixture: MessagingFixture;

    beforeEach(async () => {
        fixture = createMessagingFixture();
    });

    describe('Rule: messages are shown in reverse chronological order', () => {
        test("alice can see her 3 messages in correct order", async () => {

            const aliceMessageBuilder = messageBuilder().authoredBy("Alice");

            fixture.givenTheFollowingMessagesExists([
                aliceMessageBuilder
                    .withText("Hello world !")
                    .withId("message-1")
                    .publishedAt(new Date("2023-01-19T19:00:00.000Z"))
                    .build(),
                messageBuilder()
                    .authoredBy("The Rabbit")
                    .withText("this is my hole it was made for me")
                    .withId("message-2")
                    .publishedAt(new Date("2023-01-19T20:00:00.000Z"))
                    .build(),
                aliceMessageBuilder
                    .withText("uuuh okay")
                    .withId("message-3")
                    .publishedAt(new Date("2023-01-19T21:00:00.000Z"))
                    .build(),
                aliceMessageBuilder
                    .withText("last message")
                    .withId("message-4")
                    .publishedAt(new Date("2023-01-19T21:00:30.000Z"))
                    .build()
            ]);

            fixture.givenNowIs(new Date("2023-01-19T21:01:00.000Z"));

            await fixture.whenUserSeesTimelineOf("Alice");

            fixture.thenUserShouldSee([
                {
                    text: "last message",
                    author: "Alice",
                    publicationTime: "less than a minute ago"
                },
                {
                    text: "uuuh okay",
                    author: "Alice",
                    publicationTime: "one minute ago"
                },
                {
                    text: "Hello world !",
                    author: "Alice",
                    publicationTime: "121 minutes ago"
                }
            ]);
        });
    });
});
