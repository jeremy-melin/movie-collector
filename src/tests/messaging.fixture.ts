import { Message } from "../message";
import { InMemoryMessageRepository } from "../message.inmemory.repository";
import { PostMessageCommand, PostMessageUseCase } from "../post-message.usecase";
import { StubDateProvider } from "../stub-date-provider";
import { ViewTimelineUseCase } from "../view-timeline.usecase";

type Timeline = {
    text: string,
    author: string,
    publicationTime: string
}[];

export const createMessagingFixture = () => {
    const messageRepository = new InMemoryMessageRepository();
    const dateProvider = new StubDateProvider();
    
    const postMessageUseCase = new PostMessageUseCase(
        messageRepository,
        dateProvider
    );

    const viewTimelineUseCase = new ViewTimelineUseCase(messageRepository, dateProvider);

    let expectedTimeline: Timeline = [];
    let thrownError: Error;

    return {
        givenNowIs(now: Date) {
            dateProvider.now = now;
        },
        givenTheFollowingMessagesExists(messages: Message[]) {
            messageRepository.givenExistingMessages(messages);
        },
        async whenUserPostsAMessage(postMessageCommand: PostMessageCommand) {
            try {
                await postMessageUseCase.handle(postMessageCommand);
            } catch (error) {
                thrownError = error;
            }
        },
        async whenUserEditsAMessage(editMessageCommand: {
            id: string,
            text: string
        }) {
            // code
        },
        thenMessageShouldBe(expectedMessage: Message) {
            expect(expectedMessage).toEqual(messageRepository.getMessageById(expectedMessage.id));
        },
        thenErrorShouldBe(expectedErrorClass: new () => Error) {
            expect(thrownError).toBeInstanceOf(expectedErrorClass);
        },
        async whenUserSeesTimelineOf(author: string) {
            try {
                expectedTimeline = await viewTimelineUseCase.handle(author);
            } catch (error) {
                thrownError = error;
            }
        },
        thenUserShouldSee(timeline: Timeline) {
            expect(timeline).toEqual(expectedTimeline);
        }
    }
}


export type MessagingFixture = ReturnType<typeof createMessagingFixture>;
