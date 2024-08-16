import { expect, test, it, describe } from 'vitest'
import { aqlGrammarInstance } from '.';


const testCases = [
    "select c",
    "select c as x",
    "select c as x, d as y limit 10",
    "select c as x where xds = 10 and y = $composition_id limit 20",
    "select c from EHR ex where sd = $id and x = 23 limit 5",
    "select c from EHR ex contains OBSERVATION [openehr.v1] where sx equals 10 order by ascending limit 10"
]

describe("Test Select clause", () => {
    it("Test grammar", () => {
        expect(aqlGrammarInstance.match('Select name as n, age as a').succeeded()).toBe(true);
    });

    testCases.forEach((testCase) => {
        it(`Test case: ${testCase}`, () => {
            expect(aqlGrammarInstance.match(testCase).succeeded()).toBe(true);
        });
    }
    );

})