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

  cpp: {},
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
      //let agg = "";
      this.term = pty.spawn("/bin/sh", [], {
        name: "shell",
        cwd: process.env.PWD,
        env: process.env,
      });

      // Figuring out IPty.write() "timings" along with .onData() is difficult, so this is a temporary solution
      let catch_errors: string = "";
      let catch_warnings: string = "";

      this.term.write(current.cmd + "\r");
      this.term.write("./tmp/main_" + current.ext.substring(1) + ".out\r");

      this.term.onData((data) => {
        if (!data.includes("sh")) {
          //agg += data;
          if (data.includes("error")) {
            catch_errors += data;
          }

          if (data.includes("warning")) {
            catch_warnings += data;
          }

          console.log("Output: ", catch_errors + catch_warnings + data);
          if (catch_errors) {
            this.socket.emit("response", JSON.stringify({ message: "Terminal Output", output: catch_errors }));
          } else {
            this.socket.emit("response", JSON.stringify({ message: "Terminal Output", output: catch_warnings + data }));
          }
        }
      });

      this.term.onExit((exit) => {
        console.log("Exit code: ", exit.exitCode);
        //console.log("Aggregated Output: ", rust_agg);
      });
    }
    // Interpreted languages
    else {
      let agg = "";
      this.term = pty.spawn(current.cmd, ["tmp/main" + current.ext], {
        name: "run",
        cwd: process.env.PWD,
        env: process.env,
      });

      this.term.onData((data) => {
        console.log("Output: ", data);
        agg += data;
        this.socket.emit("response", JSON.stringify({ message: "Terminal Output", output: data }));
      });

      this.term.onExit((exit) => {
        console.log("Exit code: ", exit.exitCode);
        console.log("Aggregated Output: ", agg);
      });
    }
  }
}
