import { useEffect } from "react";
import ChatInput from "../components/ChatInput";
import Conversation from "../components/Conversation";
import Header from "../components/Header";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import { AppState } from "../types/AppState";
import { useStore } from "../store";

const Chat = styled.div`
display: flex;
flex-direction: column;
height: 100vh;
  `

const _accountNumber = (store: AppState) => store.accountNumber;

const ChatPage = () => {

  const accountNumber = useStore(_accountNumber);

  const navigate = useNavigate()

  useEffect(() => {
    async function checkAccountNumber() {

      if (!accountNumber) {
        // Navigate to welcome page
        navigate('/welcome')
      }

    }

    checkAccountNumber()

  }, [])

  return (
    <Chat>
      <Header type="chat" />
      <Conversation />
      <ChatInput />
    </Chat>
  );
};

export default ChatPage;
