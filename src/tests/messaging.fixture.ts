import { EditMessageCommand, EditMessageUseCase } from "../application/usecases//edit-message.usecase";
import { Message } from "../domain/message";
import { InMemoryMessageRepository } from "../infra/message.inmemory.repository";
import { PostMessageCommand, PostMessageUseCase } from "../application/usecases/post-message.usecase";
import { StubDateProvider } from "../infra/stub-date-provider";
import { ViewTimelineUseCase } from "../application/usecases/view-timeline.usecase";

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
    const editMessageUseCase = new EditMessageUseCase(messageRepository);
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
        async whenUserEditsAMessage(editMessageCommand: EditMessageCommand) {
            try {
                await editMessageUseCase.handle(editMessageCommand);
            } catch (error) {
                thrownError = error;
            }
        },
        async thenMessageShouldBe(expectedMessage: Message) {
            const message = await messageRepository.getbyId(expectedMessage.id);
            expect(expectedMessage).toEqual(message);
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
