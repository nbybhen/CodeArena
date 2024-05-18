import * as pty from "node-pty";
import {IPty} from "node-pty";

export default class Session {
    term: IPty;
    socket: any;
    code: string;
    constructor(socket: any, code: string) {
        this.socket = socket;
        this.code = code;
        this.term = null;
        this.run()
    }
    run(): void {
        const lang: string = "python3";
        if (this.term) {
            this.term.kill();
        }
        console.log("This.code: ", this.code);
        this.term = pty.spawn(lang, ["-c", this.code], {
            name: "xterm-color",
            cwd: process.env.HOME,
            env: process.env,
        });
        //this.term.write("print(1+1)");
        this.term.onData( (data) => {
            this.socket.emit('response', JSON.stringify({message:"Terminal Output", output: data}));
        });
    }
}