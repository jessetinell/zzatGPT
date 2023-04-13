import styled from "@emotion/styled";
import { emit } from '@tauri-apps/api/event'
import { useStore } from "../store";
import { Button } from "@mui/material";
import SettingsIcon from '@mui/icons-material/Settings';
import { Link } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Container = styled.div`
height: 3.6em;
padding:0 1em;
background: #1C1D28;
display: flex;
justify-content: space-between;
align-items: center;
position: absolute;
width: 100%;
top: 0;
z-index: 100;
left: 0;
box-shadow: 0 0 13px rgba(0, 0, 0, 0.75);

small{
  opacity: .5;
}

a{
  line-height: 0;
}

`

const Plus = styled.span`
margin-right: .8em;
`

export default function Header({ type }: { type: 'chat' | 'settings' }) {
  const messages = useStore((store) => store.messages);
  const setMessages = useStore((store) => store.setMessages);
  const setChatStatus = useStore((store) => store.setChatStatus);
  const isSmallScreen = useStore((store) => store.isSmallScreen);

  if (isSmallScreen) return null;

  const newChat = () => {
    setMessages([])
    setChatStatus(null)
    emit('focusInput')
    emit('cancelRequest')

  }

  if (type == 'settings') return (
    <Container>
      <Link to="/">
        <ArrowBackIcon />
      </Link>
    </Container>
  )

  return (
    <Container>
      {messages.length > 0 ? <Button variant="outlined" onClick={() => newChat()}><Plus>+</Plus> New chat</Button> : <div></div>}
      <Link to="/settings">
        <SettingsIcon />
      </Link>
    </Container>
  );
};


