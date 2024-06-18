import * as pty from "node-pty";
import { IPty } from "node-pty";

let lang = {
  python: {
    name: "python3",
    cmd: "python3",
    args: "-c",
  },
  rust: {
    name: "rust",
    cmd: "",
    args: "",
  },
  javascript: {
    name: "javascript",
    cmd: "node",
    args: "-e",
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
    console.log("Current language: ", current.name);
    if (this.term) {
      this.term.kill();
    }
    console.log("This.code: ", this.code);

    switch (current.name) {
      case "rust":
        this.term = pty.spawn("bash", [], {
          name: "xterm-color",
          cwd: process.env.HOME,
          env: process.env,
        });

        this.term.write(":> main.rs\r");

        this.term.write("echo '" + this.code + "' >> main.rs\r");
        this.term.write("rustc main.rs && ./main\r");
        break;

      default:
        this.term = pty.spawn(current.cmd, [current.args, this.code], {
          name: "xterm-color",
          cwd: process.env.HOME,
          env: process.env,
        });
        break;
    }

    // Figuring out IPty.write() "timings" along with .onData() is difficult, so this is a temporary solution

    let catch_errors: string = "";
    let catch_warnings: string = "";

    this.term.onData((data) => {
      if (data.includes("error")) {
        catch_errors += data;
      }

      if (data.includes("warning")) {
        catch_warnings += data;
      }

      if (!data.includes("bash-3.2$")) {
        console.log("Output: ", catch_errors + catch_warnings + data);
        if (catch_errors) {
          this.socket.emit("response", JSON.stringify({ message: "Terminal Output", output: catch_errors }));
        } else {
          this.socket.emit("response", JSON.stringify({ message: "Terminal Output", output: catch_warnings + data }));
        }
      }
    });
  }
}
