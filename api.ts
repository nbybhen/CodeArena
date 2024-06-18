import * as pty from "node-pty";
import { IPty } from "node-pty";

let lang = {
  python: {
    cmd: "python3",
    args: "-c",
  },
  rust: {
    cmd: "rust-c",
    args: "",
  },
  javascript: {
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
    console.log("Current: ", current);
    if (this.term) {
      this.term.kill();
    }
    console.log("This.code: ", this.code);
    this.term = pty.spawn(current.cmd, [current.args, this.code], {
      name: "xterm-color",
      cwd: process.env.HOME,
      env: process.env,
    });
    this.term.onData((data) => {
      this.socket.emit("response", JSON.stringify({ message: "Terminal Output", output: data }));
    });
  }
}
