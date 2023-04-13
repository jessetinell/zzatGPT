import { useEffect, useRef, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import autosize from "autosize";
import { listen } from '@tauri-apps/api/event'
import { useStore } from "../store";
import { AppState } from "../types/AppState";
import { Message } from "../types/Message";
import styled from "@emotion/styled";
import request from "../utils/request";
import { DEFAULT_INPUT_HEIGHT } from "../utils/constants";
import BoltIcon from "../assets/bolt.svg"

const _setChatStatus = (store: AppState) => store.setChatStatus;

const Form = styled.form`
display: flex;
position: relative;

textarea{
  width: 100%;
  height: ${DEFAULT_INPUT_HEIGHT}px;
  resize: none;
  box-sizing: border-box;
  font-size: 1.6rem;
  padding:.8em 1.4em .8em .5em;
  background: #1C1D28;
  color:#fff;
  border: none;
  border-radius: 5px;
  overscroll-behavior: none;
  overflow : hidden;
}
`

const SendButton = styled.button<{ disabled: boolean }>`
position: absolute;
right: 2em;
top: 1.6em;
background: none;
border: none;
cursor: pointer;
margin: 0;
padding: 0;

img{
  cursor: ${props => props.disabled ? "not-allowed" : "pointer"};
  width: 3em;
}
`

const fsetMessages = (store: AppState) => store.setMessages;

export default function ChatInput() {

  const setMessages = useStore(fsetMessages);
  const setChatStatus = useStore(_setChatStatus);
  const messages = useStore((store) => store.messages);
  const chatStatus = useStore((store) => store.chatStatus);
  const isSmallScreen = useStore((store) => store.isSmallScreen);
  const accountNumber = useStore((store) => store.accountNumber);

  const abortControllerRef = useRef<AbortController>(new AbortController());


  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {

    const unsubscribeFocusInput = listen("focusInput", () => {
      inputRef.current?.focus()
    });

    const unsubscribeCancelRequest = listen("cancelRequest", async () => {
      abortControllerRef.current.abort();
    });

    return () => {
      unsubscribeFocusInput.then(f => f());
      unsubscribeCancelRequest.then(f => f());
      abortControllerRef.current.abort();
    }

  }, []);

  useEffect(() => {

    async function adjustWindowHeight() {
      if (messages?.length === 0 && isSmallScreen && inputRef.current) {
        let height = value.length > 0 ? inputRef.current.scrollHeight : DEFAULT_INPUT_HEIGHT;
        await invoke("set_height", { height: height })
      }
    }

    if (inputRef?.current) {
      if (!value) {
        inputRef.current.style.height = DEFAULT_INPUT_HEIGHT + "px";
      }
      else {
        autosize(inputRef.current);
      }


      adjustWindowHeight();
    }
  }, [value]);


  async function handleSubmit(event: any) {

    event?.preventDefault();

    const valueBeforeSending = value || "";

    if (valueBeforeSending.length === 0 || chatStatus === "loading") return;

    const oldMessages = messages || []
    const newMessages: Message[] = [...messages, { content: valueBeforeSending, role: "user", timestamp: new Date().getTime() }]

    setValue("");
    setChatStatus("loading")
    setMessages(newMessages)

    if (inputRef?.current) {
      inputRef.current.style.height = DEFAULT_INPUT_HEIGHT + "px";
    }

    abortControllerRef.current = new AbortController();

    let { status, data } = await request(accountNumber, newMessages, { controller: abortControllerRef.current })

    if (status === 200) {
      setMessages([...newMessages, { content: data.message, role: "system", timestamp: new Date().getTime() }])
      setChatStatus(null)
    }
    else {
      // From server we can send error message in json and read it in data.
      setMessages(oldMessages)
      setValue(valueBeforeSending)

      // Status 0 = request cancelled
      if (status === 0) {
        setChatStatus(null)
      }
      else {
        console.log(status)
        if (status === 401) {
          setChatStatus("unauthorized")
        }
        else {
          setChatStatus("error")
        }
      }

    }

  }

  async function handleChange(event: any) {
    setValue(event.target.value);
  }

  async function handleKeyDown(event: any) {

    if (event.key === "Enter" && !event.shiftKey) {
      handleSubmit(event);
      return;
    }
    else if (event.key === "Escape") {
      setValue("")
      await invoke("hide")
    }
  }


  return (
    <Form onSubmit={handleSubmit}>
      <textarea
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        autoFocus
        ref={inputRef}
        maxLength={1000}
      />
      <SendButton
        disabled={chatStatus === "loading"}
        onClick={handleSubmit}
      >
        <img src={BoltIcon} />
      </SendButton>
    </Form>
  );
};


