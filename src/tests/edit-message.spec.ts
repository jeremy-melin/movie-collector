import { EmptyMessageError, MessageTooLongError } from "../post-message.usecase";
import { messageBuilder } from "./message.builder";
import { MessagingFixture, createMessagingFixture } from "./messaging.fixture";

describe('Feature: edit message', () => {
    let fixture: MessagingFixture;

    beforeEach(async () => {
        fixture = createMessagingFixture();
    });

    describe('Rule: the edited text should not be longer than 280 characters', () => {
        test('Alice can edit a text with less than 280 characters', async () => {
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

        test('Alice cannot edit a text with 281 characters', async () => {
            const messageWith281Characters = "Proin elit justo, condimentum sit amet nunc eu, hendrerit consequat turpis. Praesent pretium sollicitudin nibh, ac egestas sem maximus non. Sed sit amet sagittis orci. Aenean mattis bibendum ligula sit amet commodo. Pellentesque condimentum dui elementum, convallis turpis id eget. ";

            const originalAliceMessage = messageBuilder()
                .withId("message-id")
                .authoredBy("Alice")
                .publishedAt(new Date("2024-04-02T11:15:00.000Z"))
                .build();

            fixture.givenTheFollowingMessagesExists([
                originalAliceMessage
            ]);

            await fixture.whenUserEditsAMessage({
                id: "message-id",
                text: messageWith281Characters
            });

            fixture.thenMessageShouldBe(
                originalAliceMessage
            );

            fixture.thenErrorShouldBe(MessageTooLongError);
        });

        test('Alice cannot edit a text void', async () => {
            const originalAliceMessage = messageBuilder()
                .withId("message-id")
                .authoredBy("Alice")
                .publishedAt(new Date("2024-04-02T11:15:00.000Z"))
                .build();

            fixture.givenTheFollowingMessagesExists([
                originalAliceMessage
            ]);

            await fixture.whenUserEditsAMessage({
                id: "message-id",
                text: ""
            });

            fixture.thenMessageShouldBe(
                originalAliceMessage
            );

            fixture.thenErrorShouldBe(EmptyMessageError);
        });

        test('Alice cannot edit a text with whitespaces only', async () => {
            const originalAliceMessage = messageBuilder()
                .withId("message-id")
                .authoredBy("Alice")
                .publishedAt(new Date("2024-04-02T11:15:00.000Z"))
                .build();

            fixture.givenTheFollowingMessagesExists([
                originalAliceMessage
            ]);

            await fixture.whenUserEditsAMessage({
                id: "message-id",
                text: "     "
            });

            fixture.thenMessageShouldBe(
                originalAliceMessage
            );

            fixture.thenErrorShouldBe(EmptyMessageError);
        });
    });
});