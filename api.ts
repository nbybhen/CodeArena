import * as pty from "node-pty";
import { IPty } from "node-pty";
import * as fs from "node:fs";

let lang = {
    python: {
        name: "python3",
        cmd: "python3",
        ext: ".py",
        isCompiled: false,
    },

    rust: {
        name: "rust",
        cmd: "rustc tmp/main.rs -o tmp/main_rs.out",
        ext: ".rs",
        isCompiled: true,
    },
    
    javascript: {
        name: "javascript",
        cmd: "node",
        ext: ".js",
        isCompiled: false,
    },
    
    typescript: {},
    
    cpp: {
        name: "cpp",
        cmd: "clang++ -std=c++20 tmp/main.cpp -o tmp/main_cpp.out",
        ext: ".cpp",
        isCompiled: true,
    },
    
    c: {
        name: "c",
        cmd: "gcc tmp/main.c -o tmp/main_c.out",
        ext: ".c",
        isCompiled: true,
    },
};

export default class Session {
    term: IPty | null;
    socket: any;
    code: string;
    lang: string;

    constructor(socket: any, code: string, lang: string) {
        this.socket = socket;
        this.code = code;
        this.lang = lang;
        this.term = null;
        this.run();
    }

    run(): void {
        const current = lang[this.lang];
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
            fs.writeFileSync(path + "/tmp/main" + current.ext, this.code);
            console.log("Successfully written to file.");
        } catch (err) {
            console.log("ERROR WRITING TO FILE.");
        }

        if (current.isCompiled) {
            this.term = pty.spawn("zsh", [], {
                name: "shell",
                cwd: process.env.PWD,
                env: process.env,
            });

            let catch_warnings = "";

            this.term.write(current.cmd + "\r");
            this.term.write("./tmp/main_" + current.ext.substring(1) + ".out && exit\r");

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
                if (agg.includes("\u001b[?2004l\r\r\n")) {
                    if (agg.includes("error")) {
                        console.log("RETURNING");
                        this.socket.emit("response", JSON.stringify({ message: "Terminal Output", output: agg }));
                        return;
                    } else {
                        agg = catch_warnings;
                    }
                }

                agg += data;
            });

            this.term.onExit((exit) => {
                console.log("Exit code: ", exit.exitCode);
                console.log(`Aggregated Output: ${JSON.stringify(agg)}`);
                this.socket.emit("response", JSON.stringify({ message: "Terminal Output", output: agg }));
            });
        }
        // Interpreted languages
        else {
            this.term = pty.spawn(current.cmd, ["tmp/main" + current.ext], {
                name: "run",
                cwd: process.env.PWD,
                env: process.env,
            });

            this.term.onData((data) => {
                agg += data;
            });

            this.term.onExit((exit) => {
                console.log("Exit code: ", exit.exitCode);
                console.log(`Aggregated Output: ${agg}`);
                this.socket.emit("response", JSON.stringify({ message: "Terminal Output", output: agg }));
            });
        }
    }
}
