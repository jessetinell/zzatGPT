import { Box, Button, FormControl, Paper, Stack, TextField } from "@mui/material";
import { invoke } from "@tauri-apps/api";
import { useEffect, useState } from "react";
import { useStore } from "../store";
import { useNavigate } from "react-router-dom";

const Page = () => {

  const [enterAccountNumberIsOpen, setEnterAccountNumberIsOpen] = useState(false);
  const setIsSmallScreen = useStore((store) => store.setIsSmallScreen);
  const setAccountNumber = useStore((store) => store.setAccountNumber);
  const navigate = useNavigate()

  useEffect(() => {

    async function init() {
      setIsSmallScreen(false)
      await invoke("show")
    }

    init()

  }, [])

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    if (e.target.accountNumber?.value) {
      setAccountNumber(e.target.accountNumber.value)

      setIsSmallScreen(true)
      // await invoke("show")
      navigate('/')
    }

  }

  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        width="100%"
      >
        <Paper elevation={1} sx={{ width: "80%" }}>

          <Stack gap={1} margin={2}>
            {
              enterAccountNumberIsOpen ?
                <>
                  <p>Enter account: </p>
                  <form onSubmit={handleSubmit}>
                    <FormControl fullWidth>
                      <TextField id="accountNumber" label="Account number" variant="outlined" />
                    </FormControl>
                    <Button type="submit">Save</Button>
                  </form>
                </>
                :
                <>
                  <h1>Hello there!</h1>
                  <p>To start a chat: Press cmd+3 to open the chat.</p>

                  <Button variant="outlined" sx={{ marginTop: 2 }} onClick={() => { setEnterAccountNumberIsOpen(true) }}>
                    Got it!
                  </Button>

                </>
            }

          </Stack>
        </Paper>
      </Box>
    </>
  )

}

export default Page;
