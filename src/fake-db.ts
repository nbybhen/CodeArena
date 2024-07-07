import endent from "endent";
interface Solution {
    [key: string]: string;
}

interface Tests {
    [key: string]: string;
}

interface Starter {
    [key: string]: string;
}

const db_questions: ({
    id: number,
    title: string,
    desc: string,
    languages: string[],
    diff: string,
    solution: Solution,
    tests: Tests,
    starter: Starter,
})[] = [
    {
        id: 0,
        title: "Hello World!",
        desc: "A simple \'Hello World!\' program! Surely you can do that...",
        languages:  ["rust", "python", "kotlin", "java"],
        diff: "Novice",
        solution: {
            rust: endent`fn hello_world_sol() -> &'static str {
                            "Hello World!"
                         }`
        },
        tests: {
            rust: endent`#[cfg(test)]
                        mod tests {
                            use super::*;
                        
                            #[test]
                            fn basic_test() {
                                assert_eq!(hello_world(), hello_world_sol());
                            }
                        }
            `
        },
        starter: {
            rust: endent`fn hello_world() -> &'static str {
                // Put solution here.
            }`
        }
    },
    {
        id: 1,
        title: "TEMP 2",
        desc: "This is question #2.",
        languages: ["rust"],
        diff: "Journeyman",
        solution: {},
        tests: {},
        starter: {},


    },
    {
        id: 2,
        title: "TEMP 3",
        desc: "This is question #3.",
        languages: ["kotlin"],
        diff: "Novice",
        solution: {},
        tests: {},
        starter: {}
    },
    {
        id: 3,
        title: "TEMP 4",
        desc: "This is question #4.",
        languages: ["java"],
        diff: "Novice",
        solution: {},
        tests: {},
        starter: {}
    },
    {
        id: 4,
        title: "TEMP 5",
        desc: "This is question #5.",
        languages: ["go"],
        diff: "Novice",
        solution: {},
        tests: {},
        starter: {}
    },
    {
        id: 5,
        title: "TEMP 6",
        desc: "This is question #6.",
        languages: ["typescript"],
        diff: "Novice",
        solution: {},
        tests: {},
        starter: {}
    },
    {
        id: 6,
        title: "TEMP 7",
        desc: "This is question #7.",
        languages: ["javascript"],
        diff: "Novice",
        solution: {},
        tests: {},
        starter: {}
    },
    {
        id: 7,
        title: "TEMP 8",
        desc: "This is question #8.",
        languages: ["c"],
        diff: "Novice",
        solution: {},
        tests: {},
        starter: {}
    },
    {
        id: 8,
        title: "TEMP 9",
        desc: "This is question #9.",
        languages: ["cpp"],
        diff: "Novice",
        solution: {},
        tests: {},
        starter: {}
    },
    {
        id: 9,
        title: "TEMP 10",
        desc: "This is question #10.",
        languages: ["elixir"],
        diff: "Novice",
        solution: {},
        tests: {},
        starter: {}
    },
]

export default db_questions;