
import { EmptyMessageError, MessageTooLongError } from "../post-message.usecase";
import { messageBuilder } from "./message.builder";
import { MessagingFixture, createMessagingFixture } from "./messaging.fixture";

describe("Feature: Posting a message", () => {

    let fixture: MessagingFixture;

    const aliceMessageBuilder =  messageBuilder()
        .withId("message-id")
        .authoredBy("Alice")
        .withText("Hello wolrd !")
        .publishedAt(new Date("2023-01-19T19:00:00.000Z"));

    beforeEach(async () => {
        fixture = createMessagingFixture();
    });

    describe("Rule: A message can contain a maximum of 280 characters", () => {
        test("Alice can post a message on her timeline", async() => {
            fixture.givenNowIs(new Date("2023-01-19T19:00:00.000Z"));

            await fixture.whenUserPostsAMessage(
                aliceMessageBuilder.build()
            );

            fixture.thenMessageShouldBe(
                aliceMessageBuilder.build()
            )
        });

        test("Alice cannot post a message with more than 280 characters", async () => {
            const messageWith281Characters = "Proin elit justo, condimentum sit amet nunc eu, hendrerit consequat turpis. Praesent pretium sollicitudin nibh, ac egestas sem maximus non. Sed sit amet sagittis orci. Aenean mattis bibendum ligula sit amet commodo. Pellentesque condimentum dui elementum, convallis turpis id eget. ";
            
            fixture.givenNowIs(new Date("2023-01-19T19:00:00.000Z"));
            await fixture.whenUserPostsAMessage(
                aliceMessageBuilder
                    .withText(messageWith281Characters)
                    .build()
                );
            fixture.thenErrorShouldBe(MessageTooLongError);
        })
    });
    describe("Rule: A message cannot be empty", () => {
        test("Alice cannot post an empty message", async () => {
            fixture.givenNowIs(new Date("2023-01-19T19:00:00.000Z"));
            await fixture.whenUserPostsAMessage(
                aliceMessageBuilder
                    .withText("")
                    .build()
            );
            fixture.thenErrorShouldBe(EmptyMessageError);
        });
        test("Alice cannot post a message with only whitespaces", async () => {
            fixture.givenNowIs(new Date("2023-01-19T19:00:00.000Z"));
            await fixture.whenUserPostsAMessage(
                aliceMessageBuilder
                    .withText("    ")
                    .build()
            );
            fixture.thenErrorShouldBe(EmptyMessageError);
        });
    });
});
