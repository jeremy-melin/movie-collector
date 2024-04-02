import { messageBuilder } from "./message.builder";
import { MessagingFixture, createMessagingFixture } from "./messaging.fixture";

describe('Feature: edit message', () => {
    let fixture: MessagingFixture;

    beforeEach(async () => {
        fixture = createMessagingFixture();
    });

    describe('Rule: the edited text should not be longer than 280 characters', () => {
        xtest('Alice can edit a text with less than 280 characters', async () => {
            const aliceMessageBuilder = messageBuilder()
                .withId("message-id")
                .authoredBy("Alice")
                .publishedAt(new Date("2024-04-02T11:15:00.000Z"))

            fixture.givenTheFollowingMessagesExists([
                aliceMessageBuilder
                    .withText("hello wrld")
                    .build()
            ]);

            await fixture.whenUserEditsAMessage({
                id: "message-id",
                text: "hello world !"
            });

            fixture.thenMessageShouldBe(
                aliceMessageBuilder
                    .withText("hello world !")
                    .build()
            );
        });
    });
});