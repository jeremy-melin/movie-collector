import * as path from 'path';
import * as fs from 'fs';
import { FileSystemFolloweeRepository } from '../followee.fs.repository';

const testFolloweesPath = path.join(__dirname, './followees-test.json');


describe('FileSystemFolloweeRepository', () => {

    beforeEach(async () => {
        await fs.promises.writeFile(testFolloweesPath, JSON.stringify({}));
    });

    test('saveFollowee should save a new followee ', async () => {
        const followeeRepository = new FileSystemFolloweeRepository(testFolloweesPath);
        
        await fs.promises.writeFile(testFolloweesPath, JSON.stringify({
            Alice: ["Bob"],
            Bob: ["Charly"]
        }));

        await followeeRepository.saveFollowee({ user: "Alice", followee: "Charly" });

        const followeesData = await fs.promises.readFile(testFolloweesPath);
        const followeesJSON = JSON.parse(followeesData.toString());
        expect(followeesJSON).toEqual({
            Alice: ["Bob", "Charly"],
            Bob: ["Charly"]
        });
    });

    test('saveFollowee should save a new followee when there was no followee before ', async () => {
        const followeeRepository = new FileSystemFolloweeRepository(testFolloweesPath);
        
        await fs.promises.writeFile(testFolloweesPath, JSON.stringify({
            Bob: ["Charly"]
        }));
        
        await followeeRepository.saveFollowee({ user: "Alice", followee: "Charly" });

        const followeesData = await fs.promises.readFile(testFolloweesPath);
        const followeesJSON = JSON.parse(followeesData.toString());
        expect(followeesJSON).toEqual({
            Alice: ["Charly"],
            Bob: ["Charly"]
        });
    });

    test('getFolloweesOf should return the user followees', async () => {
        const followeeRepository = new FileSystemFolloweeRepository(testFolloweesPath);
        await fs.promises.writeFile(testFolloweesPath, JSON.stringify({
            Alice: ["Bob", "Charly"],
            Bob: ["Charly"]
        }));

        const [aliceFollowees, BobFollowees] = await Promise.all([
            followeeRepository.getFolloweesOf("Alice"),
            followeeRepository.getFolloweesOf("Bob")
        ]);

        expect(aliceFollowees).toEqual(["Bob", "Charly"]);
        expect(BobFollowees).toEqual(["Charly"]);
    });
});