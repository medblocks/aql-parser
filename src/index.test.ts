import { expect, test, it, describe } from 'vitest'
import { AQLParser } from '.';

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
        const a = AQLParser().parse('select c from EHR ex contains OBSERVATION [openehr.v1] where sx equals 10 order by ascending limit 10');
        expect(a).toBeDefined();
    });

    testCases.forEach((testCase) => {
        it(`Test case: ${testCase}`, () => {
            expect(AQLParser().parse(testCase)).toBeDefined()
        });
    });

})