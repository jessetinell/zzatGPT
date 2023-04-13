import styled from "@emotion/styled";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useEffect, useRef } from "react";
import { useStore } from "../store";
import { Message } from "../types/Message";
import Typing from "./Typing";
import Markdown from "./Markdown";
import systemAvatar from "../assets/chatgpt-icon.svg"
import { Button } from "@mui/material";
import { emit } from "@tauri-apps/api/event";
import { Link } from "react-router-dom";

const Container = styled.div<{ isSmallScreen: boolean }>`
overflow-y: auto;
flex-grow: 1;
flex-shrink: 1;
justify-content: center;
flex-direction: column;
padding-top: ${props => props.isSmallScreen ? "0" : "3.6em"};
`

const MessageRow = styled.div<Message>`
  padding:2.5em 1.5em 2.5em 2em;
  display: flex;
  align-items: top;
  background: ${props => props.role == "user" ? "#272938" : "#2f3142"};

  p{
    margin: 0;
  }

  .avatar{
    max-width: 1.7em;
    width: auto;
    height: 1.7em;
    margin-right: 1em;
  }

  img{
    width:15em;
    max-width: 80%;
  }
  `

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  color: rgb(255, 161, 161);
  `

const LoadingMessage = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  
  button{
    opacity: .5;
  }
  `

export default function Conversation() {
  const messages = useStore((store) => store.messages);
  const chatStatus = useStore((store) => store.chatStatus);
  const isSmallScreen = useStore((store) => store.isSmallScreen);
  const setIsSmallScreen = useStore((store) => store.setIsSmallScreen);
  const containerRef = useRef<any>(null)

  useEffect(() => {
    if (messages?.length == 0) return;

    if (messages?.length > 0 && isSmallScreen) {
      setIsSmallScreen(false)
    }

    containerRef.current.scrollTop = containerRef.current.scrollHeight;

  }, [messages])

  return (
    <Container ref={containerRef} isSmallScreen={isSmallScreen}>
      {messages?.map((message: Message, i) => {
        return <MessageRow key={i} role={message.role}>
          {message.role === "system" ? <>
            <div>
              <img className="avatar" src={systemAvatar} />
            </div>
            <div>
              <Markdown content={message.content} />
            </div>
          </>
            : <div>
              <Markdown content={message.content?.replace(/\n/g, "&nbsp; \n")} options={{
                allowedElements: ["br", "p"]
              }} />
            </div>
          }

        </MessageRow>
      })
      }

      {chatStatus == "loading" &&
        <MessageRow role="system">
          <LoadingMessage>
            <Typing />
            <Button onClick={() => {
              emit("cancelRequest")
            }}>Cancel</Button>
          </LoadingMessage>
        </MessageRow>}

      {chatStatus == "error" &&
        <MessageRow role="system">
          <ErrorMessage>
            <ErrorOutlineIcon style={{ marginRight: '.4em' }} />
            <p>
              Something went wrong. Please try again.
            </p>
          </ErrorMessage>
        </MessageRow>}

      {chatStatus == "unauthorized" &&
        <MessageRow role="system">
          <ErrorMessage>
            <ErrorOutlineIcon style={{ marginRight: '.4em' }} />
            <p>
              Invalid account number. Please add a valid account number in the <Link to="/settings">settings</Link>
            </p>
          </ErrorMessage>
        </MessageRow>}

    </Container>
  );
};


