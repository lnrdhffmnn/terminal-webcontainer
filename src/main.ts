import "./style.css";
import "xterm/css/xterm.css";
import { Terminal } from "xterm";
import { WebContainer } from "@webcontainer/api";

const terminalElement = document.querySelector<HTMLDivElement>("#terminal")!;
const terminal = new Terminal({
  convertEol: true,
  cursorBlink: true,
  tabStopWidth: 2,
});

terminal.open(terminalElement);

const webContainer = await WebContainer.boot();
const shell = await webContainer.spawn("jsh");

shell.output.pipeTo(
  new WritableStream({
    write(data) {
      terminal.write(data);
    },
  })
);

const input = shell.input.getWriter();

terminal.onData(data => {
  input.write(data);
});
