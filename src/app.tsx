import { FormEvent, useEffect, useRef, useState } from "react";
import ANSIToHTML from "ansi-to-html";
import { getWebContainerInstance } from "./lib/web-container";

export default function App() {
  const [userInput, setUserInput] = useState("");
  const [output, setOutput] = useState<string[]>([]);

  const userInputRef = useRef<HTMLInputElement>(null);

  const ANSIConverter = new ANSIToHTML();

  useEffect(() => {
    scrollTo({ top: document.body.scrollHeight, left: 0, behavior: "smooth" });
  }, [output]);

  async function handleCommandRun(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const webContainer = await getWebContainerInstance();

    const command = userInput.split(" ")[0];
    const args = userInput.split(" ").slice(1);

    setUserInput("");
    setOutput(state => [...state, `$ ${userInput}`]);

    const run = await webContainer.spawn(command, args);

    run.output.pipeTo(
      new WritableStream({
        write(data) {
          setOutput(state => [...state, ANSIConverter.toHtml(data)]);
        },
      })
    );
  }

  return (
    <div
      className="min-w-full min-h-screen flex flex-col bg-black text-white font-mono font-bold p-4 relative"
      onClick={() => {
        userInputRef.current?.focus();
      }}
    >
      {output.map(line => (
        <p key={line} dangerouslySetInnerHTML={{ __html: line }} />
      ))}
      <form onSubmit={handleCommandRun} className="flex gap-2">
        <span>$</span>
        <input
          type="text"
          value={userInput}
          onChange={event => setUserInput(event.target.value)}
          autoFocus
          ref={userInputRef}
          className="bg-transparent outline-none w-full"
        />
      </form>
    </div>
  );
}
