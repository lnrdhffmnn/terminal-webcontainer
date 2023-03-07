import "./style.css";
import "xterm/css/xterm.css";
import { Terminal } from "xterm";
import { WebContainer } from "@webcontainer/api";
import { FitAddon } from "xterm-addon-fit";
import { WebLinksAddon } from "xterm-addon-web-links";

const terminalElement = document.querySelector<HTMLDivElement>("#terminal")!;
const terminal = new Terminal({
  convertEol: true,
  cursorBlink: true,
  tabStopWidth: 2,
});
const fitAddon = new FitAddon();
const webLinksAddon = new WebLinksAddon();

terminal.loadAddon(fitAddon);
terminal.loadAddon(webLinksAddon);
terminal.open(terminalElement);
fitAddon.fit();

const webContainer = await WebContainer.boot();
const shell = await webContainer.spawn("jsh", {
  terminal: {
    cols: terminal.cols,
    rows: terminal.rows,
  },
});

window.addEventListener("resize", () => {
  fitAddon.fit();
  shell.resize({
    cols: terminal.cols,
    rows: terminal.rows,
  });
});

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
