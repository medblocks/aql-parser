import { expect, test, it, describe } from 'vitest'
import { aqlGrammar, myGrammar } from '.';

describe("Test Basics", () => {
    it('should be true', () => {
        expect(true).toBe(true);
    });

    it('Test Mygrammar', () => {
        expect(myGrammar.match('Hola').succeeded()).toBe(true);
        expect(myGrammar.match('Sayonara').succeeded()).toBe(false);
    });
});


describe("Test Select clause", () => {
    it("Test grammar", () => {
        expect(aqlGrammar.match('Select name as n, age as a').succeeded()).toBe(true);
    });
})