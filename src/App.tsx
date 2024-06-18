import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import "./App.css";
import { XTerm } from "xterm-for-react";
import { FitAddon } from "xterm-addon-fit";

import { Editor } from "@monaco-editor/react";

export default function App() {
  let xTermRef = useRef(null);
  let editorRef = useRef(null);
  let [input, setInput] = useState<string>("");
  //let [entries, setEntries] = useState([]);
  const [selectedValue, setSelectedValue] = useState({ name: "python", default: "print(1+1)" });

  const fitAddon = new FitAddon();

  const socket = io("ws://localhost:4000");

  socket.on("return", (msg) => {
    console.log("Server said: ", msg);
  });

  socket.on("response", (event) => {
    console.log("TERMINAL PROCESSED!", event);
    try {
      let msg = JSON.parse(event);
      console.log("Parsed message!", msg.message);
      xTermRef.current.terminal.clear();
      xTermRef.current.terminal.write(msg.output);
    } catch (err) {
      console.log("Malformed message from terminal: ", event.data);
      return;
    }
  });

  function handleChange(event: any) {
    switch (event.target.value) {
      case "python":
        setSelectedValue({ name: event.target.value, default: "print(1+1)" });
        break;
      case "rust":
        setSelectedValue({
          name: event.target.value,
          default: `fn main() {
              println!("{}", 1+1);
            }`,
        });
        break;
      case "javascript":
        setSelectedValue({ name: event.target.value, default: "console.log(1+1);" });
        break;
      default:
        setSelectedValue({ name: event.target.value, default: "No default implementation" });
        break;
    }
  }

  function linkEditor(editor, monaco) {
    editorRef.current = editor;
  }

  function handleClick() {
    console.log("Button clicked!");
    socket.emit("message", { lang: selectedValue.name, code: editorRef.current.getValue() });
  }

  useEffect(() => {
    console.log("Input: ", input);
    console.log("input charcode: ", input.charCodeAt(0));
  }, [input, xTermRef]);

  return (
    <div className="App">
      <header className="App-header">
        <div style={{ marginBottom: "50px", display: "flex" }}>
          <div style={{ marginRight: "20px" }}>
            <Editor height={"90vh"} width={"50vw"} language={selectedValue.name} value={selectedValue.default} onMount={linkEditor} />
          </div>

          <div className={"terminal"}>
            <XTerm
              ref={xTermRef}
              addons={[fitAddon]}
              onData={(data: string) => {
                setInput(data);
                xTermRef.current.terminal.write(data);
              }}
              onKey={(event: { domEvent: { key: string } }) => {
                if (event.domEvent.key === "Backspace") {
                  if (input) {
                    xTermRef.current.terminal.write("\b \b");
                  }
                }
                if (event.domEvent.key === "Enter") {
                  if (input) {
                    // setEntries(oldArray => [...oldArray, input]);
                    xTermRef.current.terminal.write("\r\n");
                  }
                }
              }}
            />
            <button style={{ width: "50px", height: "20px" }} onClick={handleClick}>
              Run
            </button>
            <select value={selectedValue.name} onChange={handleChange} name="languages" id="languages">
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
              <option value="rust">Rust</option>
            </select>
          </div>
        </div>
      </header>
    </div>
  );
}
