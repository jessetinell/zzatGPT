import { useStore } from "./store";
import "./index.css";
import { emit } from '@tauri-apps/api/event'
import { enable, isEnabled } from "tauri-plugin-autostart-api";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ChatPage from "./pages/ChatPage";
import Settings from "./pages/Settings";
import Welcome from "./pages/Welcome";
import { useEffect } from "react";
import { invoke } from "@tauri-apps/api";
import { DEFAULT_INPUT_HEIGHT } from "./utils/constants";
import { AppState } from "./types/AppState";

const _setMessages = (store: AppState) => store.setMessages;
const _isSmallScreen = (store: AppState) => store.isSmallScreen;

const theme = createTheme({
  typography: {
    button: {
      textTransform: "none"
    }
  },
  palette: {
    background: {
      default: "#242533",
      paper: "#242533",
    },
    primary: {
      main: '#fff',
    },
    mode: "dark"
  },
})

const App = () => {

  const setMessages = useStore(_setMessages);
  const setIsSmallScreen = useStore((store) => store.setIsSmallScreen);
  const isSmallScreen = useStore(_isSmallScreen);

  useEffect(() => {

    // Check if this app autostarts on startup, if not, make it do so.
    async function checkAutostart() {
      const enabled = await isEnabled()
      if (!enabled) {
        await enable()
      }
    }

    checkAutostart()

    const handleFocus = () => {
      emit('focusInput')

      const now = new Date().getTime()
      const lastOpenedChat = localStorage.getItem('lastOpenedChat') ? parseInt(localStorage.getItem('lastOpenedChat') || "0") : 0;

      if (lastOpenedChat > 0) {

        // If user last opened the chat more than 5 minutes ago, clear the chat
        const diffInMinutes = (now - lastOpenedChat) / 1000 / 60;

        if (diffInMinutes > 5) {
          setIsSmallScreen(true)
        }

      }

      localStorage.setItem('lastOpenedChat', now.toString());
    }

    window.addEventListener("focus", handleFocus)

    return () => {
      window.removeEventListener("focus", handleFocus)
    }

  }, []);

  useEffect(() => {

    async function enlargeWindow() {
      await invoke("set_height", { height: 0 })
      await invoke("center_window")
    }

    async function minimizeWindow() {
      await invoke("set_height", { height: DEFAULT_INPUT_HEIGHT })
    }

    if (isSmallScreen) {
      minimizeWindow()
      // Clear the messages when minimizing
      setMessages([])
    }
    else {
      enlargeWindow()
    }

  }, [isSmallScreen])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ChatPage />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/welcome" element={<Welcome />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
