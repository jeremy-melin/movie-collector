import { FollowUserUseCase } from "../application/usecases/follow-user.usecase";
import { InMemoryFolloweeRepository } from "../infra/followee.inmemory.repository";

describe('Feature: following a user', () => {

    let fixture: Fixture;

    beforeEach(()=> {
        fixture = createFixture();
    })
    test('Alice can follow Bob', async() => {
        fixture.givenUserFollowees({
            user: "Alice",
            followees: ["Charly"]
        });

        await fixture.whenUserFollow({
            user: "Alice",
            userToFollow: "Bob"
        });

        await fixture.thenUserFolloweesAre({
            user: "Alice",
            followees: ["Charly", "Bob"]
        })
    });
});

const createFixture = () => {
    const followeeRepository = new InMemoryFolloweeRepository();
    const followUserUseCase = new FollowUserUseCase(followeeRepository);


    return {
        givenUserFollowees({user, followees}: {user: string, followees: string[]}) {
            followeeRepository.givenExistingFollowees(followees.map(f => ({
                user,
                followee: f
            })))
        },
        async whenUserFollow(followcommand: {user: string, userToFollow: string}) {
            await followUserUseCase.handle(followcommand);
        },
        async thenUserFolloweesAre(userFollowees: {user: string, followees: string[]}) {
            const actualFollowees = followeeRepository.getFolloweesOf(userFollowees.user);
            expect(actualFollowees).toEqual(userFollowees.followees);
        }
    }
}

type Fixture = ReturnType<typeof createFixture>;