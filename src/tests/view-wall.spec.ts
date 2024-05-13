import { FolloweeRepository } from "../application/followee.repository";
import { MessageRepository } from "../application/message.repository";
import { ViewWallUseCase } from "../application/usecases/view-wall.usecase";
import { StubDateProvider } from "../infra/stub-date-provider";
import { FollowingFixture, createFollowingFixture } from "./following.fixture";
import { messageBuilder } from "./message.builder";
import { MessagingFixture, createMessagingFixture } from "./messaging.fixture";

describe('Feature: Viewing users wall', () => {

    let messagingFixture: MessagingFixture;
    let followingFixture: FollowingFixture;
    let fixture: Fixture;

    beforeEach(() => {
        messagingFixture = createMessagingFixture();
        followingFixture = createFollowingFixture();
        fixture = createFixture({
            messageRepository: messagingFixture.messageRepository,
            followeeRepository: followingFixture.followeeRepository
        });
    })

    describe('Rule: all the messages from the user and her followees should appear in reverse chronological order', () => {
        test('Charly has subscribed to Alice timeline and thus can view aggregated list of all subscriptions', async () => {
            fixture.givenNowIs(new Date("2023-01-19T19:00:00.000Z"));

            messagingFixture.givenTheFollowingMessagesExists([
                messageBuilder()
                    .withId("message-id")
                    .authoredBy("Alice")
                    .withText("menfou")
                    .publishedAt(new Date("2023-01-19T18:59:20.000Z"))
                    .build(),
                messageBuilder()
                    .withId("message-2")
                    .authoredBy("Charly")
                    .withText("menfou aussi")
                    .publishedAt(new Date("2023-01-19T18:59:30.000Z"))
                    .build()
            ]);

            followingFixture.givenUserFollowees({ user: "Charly", followees: ["Alice"] });

            await fixture.whenUserSeesTheWallOf("Charly");

            fixture.thenUserShouldSee([
                {
                    author: "Charly",
                    text: "menfou aussi",
                    publicationTime: "less than a minute ago",
                },
                {
                    author: "Alice",
                    text: "menfou",
                    publicationTime: "less than a minute ago",
                },
            ])
        });
    });
});

const createFixture = ({
    messageRepository,
    followeeRepository
}: {
    messageRepository: MessageRepository,
    followeeRepository: FolloweeRepository
}) => {

    let wall: { author: string, text: string, publicationTime: string }[];

    const dateProvider = new StubDateProvider();
    const viewWallUseCase = new ViewWallUseCase(messageRepository, followeeRepository, dateProvider);

    return {
        givenNowIs(now: Date) {
            dateProvider.now = now;
        },
        async whenUserSeesTheWallOf(user: string) {
            wall = await viewWallUseCase.handle(user);
        },
        thenUserShouldSee(expectedWall: { author: string, text: string, publicationTime: string }[]) {
            expect(wall).toEqual(expectedWall);
        }
    }
};

export type Fixture = ReturnType<typeof createFixture>;
