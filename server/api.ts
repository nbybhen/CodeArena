import * as pty from "node-pty";
import { IPty } from "node-pty";
import * as fs from "node:fs";
import stripAnsi from "strip-ansi";

let lang = {
    python: {
        name: "python3",
        cmds: ["python3 tmp/main.py && exit"],
        ext: ".py",
    },

    rust: {
        name: "rust",
        //cmds: ["rustc tmp/main.rs -o tmp/main.out", "tmp/main.out", "exit"],
        cmds: ["cd tmp/rust", "cargo test", "exit"],
        ext: ".rs",
    },

    javascript: {
        name: "javascript",
        cmds: ["node tmp/main.js && exit"],
        ext: ".js",
    },

    typescript: {
        name: "typescript",
        cmds: ["npx tsx tmp/main.ts && exit"],
        ext: ".ts",
    },

    cpp: {
        name: "cpp",
        cmds: ["clang++ -std=c++20 tmp/main.cpp -o tmp/main.out", "tmp/main.out && exit"],
        ext: ".cpp",
    },

    c: {
        name: "c",
        cmds: ["gcc tmp/main.c -o tmp/main.out", "tmp/main.out && exit"],
        ext: ".c",
    },

    // .kts = Kotlin Script file
    kotlin: {
        name: "kotlin",
        cmds: ["kotlinc -script tmp/main.kts && exit"],
        ext: ".kts",
    },

    java: {
        name: "java",
        cmds: ["javac tmp/Main.java", "java -classpath tmp Main && exit"],
        ext: ".java",
    },

    go: {
        name: "go",
        cmds: ["go run tmp/main.go && exit"],
        ext: ".go",
    },

    elixir: {
        name: "elixir",
        cmds: ["elixir tmp/main.exs && exit"],
        ext: ".exs",
    },
};

export default class Session {
    term: IPty | null;
    socket: any;
    code: string;
    lang: string;
    isIDE: boolean;

    constructor(socket: any, code: string, lang: string, ide: boolean) {
        this.socket = socket;
        this.code = code;
        this.lang = lang;
        this.isIDE = ide;
        this.term = null;

        if(this.isIDE) {
            this.runIDE();
        }
        else {
            this.run();
        }
    }

    runIDE(): void {
        // @ts-ignore
        const current: { name: string; cmds: string[]; ext: string; } = lang[this.lang];
        console.log("Current: ", current);

        let path = process.env.PWD!;

        let agg = "";

        // Ensures the language chosen has a backend implemention completed.
        if (current === undefined) {
            this.socket.emit("response", JSON.stringify({ message: "Terminal Output", output: "This language is not implemented yet." }));
            return;
        }

        if (this.term) {
            this.term.kill();
        }

        // Ensures a tmp directory exists
        if (!fs.existsSync(path + "/tmp")) {
            fs.mkdirSync(path + "/tmp");
        }

        try {
            if (current.name === "java") {
                fs.writeFileSync(path + `/tmp/Main.java`, this.code);
            } else if (current.name === "rust") {
                fs.writeFileSync(path + "/tmp/rust/src/main.rs", this.code);
            } else {
                fs.writeFileSync(path + "/tmp/main" + current.ext, this.code);
            }
            console.log("Successfully written to file.");
        } catch (err) {
            console.log("ERROR WRITING TO FILE.");
            return;
        }

        this.term = pty.spawn("zsh", [], {
            name: "zsh",
            cwd: process.env.PWD,
            env: process.env,
        });

        let catch_warnings = "";

        current.cmds.forEach(
            function (cmd: string) {
                console.log(`Running: ${cmd}`);
                this.term.write(cmd + "\r");
            }.bind(this),
        );

        this.term.onData((data) => {
            switch (current.name) {
                case "rust":
                    if (data.includes("warning")) {
                        catch_warnings += data;
                    }
                    break;
                default:
                    break;
            }

            // If the code errored on compilation, return the error instead of running the exe
            // The below agg.includes() is due to oh-my-zsh and may need to be changed for Docker
            if (agg.toLowerCase().includes("error")) {
                console.log("RETURNING");
                this.socket.emit("response", JSON.stringify({ message: "Terminal Output", output: agg }));
                return;
            }

            if ((agg.includes("\u001b[?2004l\r\r\n")) && !agg.includes("panic")) {
                agg = catch_warnings;
            }

            data = stripAnsi(data);

            agg += data;
        });

        this.term.onExit((exit: any) => {
            let splt = agg.split('\n');
            let newAgg = "";

            splt.forEach((line) => {
                let isIn = false;
                current.cmds.forEach((cmd) => {
                    if(line.includes(cmd)) {
                        isIn = true;
                        return;
                    }
                });

                if(!isIn) {
                    newAgg += (line + "\n");
                }
            })

            console.log("Exit code: ", exit.exitCode);
            console.log(`Aggregated Output: ${JSON.stringify(newAgg)}`);
            this.socket.emit("response", JSON.stringify({ message: "Terminal Output", output: newAgg, code: exit.exitCode }));
        });
    }

    run(): void {
        // @ts-ignore
        const current: { name: string; cmds: string[]; ext: string; } = lang[this.lang];
        console.log("Current: ", current);

        let path = process.env.PWD!;

        let agg = "";

        // Ensures the language chosen has a backend implemention completed.
        if (current === undefined) {
            this.socket.emit("response", JSON.stringify({ message: "Terminal Output", output: "This language is not implemented yet." }));
            return;
        }

        if (this.term) {
            this.term.kill();
        }

        // Ensures a tmp directory exists
        if (!fs.existsSync(path + "/tmp")) {
            fs.mkdirSync(path + "/tmp");
        }

        try {
            if (current.name === "java") {
                fs.writeFileSync(path + `/tmp/Main.java`, this.code);
            } else if (current.name === "rust") {
                fs.writeFileSync(path + "/tmp/rust/src/main.rs", this.code);
            } else {
                fs.writeFileSync(path + "/tmp/main" + current.ext, this.code);
            }
            console.log("Successfully written to file.");
        } catch (err) {
            console.log("ERROR WRITING TO FILE.");
            return;
        }

        this.term = pty.spawn("zsh", [], {
            name: "zsh",
            cwd: process.env.PWD,
            env: process.env,
        });

        let catch_warnings = "";

        current.cmds.forEach(
            function (cmd: string) {
                console.log(`Running: ${cmd}`);
                this.term.write(cmd + "\r");
            }.bind(this),
        );

        this.term.onData((data) => {
            switch (current.name) {
                case "rust":
                    if (data.includes("warning")) {
                        catch_warnings += data;
                    }
                    break;
                default:
                    break;
            }

            // If the code errored on compilation, return the error instead of running the exe
            // The below agg.includes() is due to oh-my-zsh and may need to be changed for Docker
            if (agg.toLowerCase().includes("error")) {
                console.log("RETURNING");
                this.socket.emit("response", JSON.stringify({ message: "Terminal Output", output: agg }));
                return;
            }

            if ((agg.includes("\u001b[?2004l\r\r\n")) && !agg.includes("panic")) {
                agg = catch_warnings;
            }

            data = stripAnsi(data);

            agg += data;
        });

        this.term.onExit((exit: any) => {
            let splt = agg.split('\n');
            let newAgg = "";

            splt.forEach((line) => {
                let isIn = false;
                current.cmds.forEach((cmd) => {
                    if(line.includes(cmd)) {
                        isIn = true;
                        return;
                    }
                });

                if(!isIn) {
                    newAgg += (line + "\n");
                }
            })

            console.log("Exit code: ", exit.exitCode);
            console.log(`Aggregated Output: ${JSON.stringify(newAgg)}`);
            this.socket.emit("response", JSON.stringify({ message: "Terminal Output", output: newAgg, code: exit.exitCode }));
        });
    }
}
