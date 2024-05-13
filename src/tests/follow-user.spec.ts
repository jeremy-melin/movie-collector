import { FollowingFixture, createFollowingFixture } from "./following.fixture";

describe('Feature: following a user', () => {

    let fixture: FollowingFixture;

    beforeEach(()=> {
        fixture = createFollowingFixture();
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

