import { Box, Button, FormControl, InputLabel, MenuItem, Paper, Select, Stack, TextField } from "@mui/material";
import { getVersion } from '@tauri-apps/api/app';
import { isEnabled } from "tauri-plugin-autostart-api";
import { useForm } from "react-hook-form";
import { useStore } from "../store";
import { useEffect, useState } from "react";
import Header from "../components/Header";

const sFSelector = (store: any) => store.saveStore;

const Settings = () => {

  const accountNumber = useStore((store) => store.accountNumber);
  const [version, setVersion] = useState('')
  const [autostartIsEnabled, setAutostartIsEnabled] = useState(false)
  const setAccountNumber = useStore((store) => store.setAccountNumber);
  const saveStore = useStore(sFSelector);

  const [formIsSaving, setFormIsSaving] = useState(false)

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      accountNumber
    }
  });

  useEffect(() => {

    async function init() {
      const version = await getVersion()

      if (version) {
        setVersion(version)
      }

      setAutostartIsEnabled(await isEnabled())

    }

    init()

  }, [])


  const onSubmit = (data: any) => {

    if (formIsSaving) {
      return;
    }

    if (data.accountNumber) {

      setFormIsSaving(true)
      setAccountNumber(data.accountNumber)

      setTimeout(() => {
        setFormIsSaving(false)
      }, 1000)

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
        <Header type="settings" />

        <Stack gap={1} margin={2}>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* <FormControl fullWidth margin="normal" >
              <InputLabel id="model">AI model</InputLabel>
              <Select
                labelId="model"
                id="demo-simple-select"
                value={"3"}
                label="AI model"
              >
                <MenuItem value="3">GPT 3.5</MenuItem>
                <MenuItem disabled>GPT 4 (coming soon)</MenuItem>
                <MenuItem disabled>Bard (coming soon)</MenuItem>
                <MenuItem disabled>LLaMA (coming soon)</MenuItem>
                <MenuItem disabled>GPT-NeoX (coming soon)</MenuItem>
                <MenuItem disabled>Custom (coming soon)</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <TextField id="outlined-basic" label="OpenAI token (coming soon)" disabled variant="outlined" />
            </FormControl> */}

            <FormControl fullWidth margin="normal">
              <TextField id="outlined-basic" label="Account number" variant="outlined"
                required
                {...register("accountNumber")}
              />
            </FormControl>


            <Button variant="contained" type="submit" disabled={formIsSaving} fullWidth sx={{ padding: '1em ', marginTop: 2 }}>
              {formIsSaving ? "Saving..." : "Save"}
            </Button>

          </form>
          <br />
          <p>
            <b>Autostart:</b> {autostartIsEnabled ? "Enabled" : "Disabled"}
            <br />
            <b>Feedback:</b> zzat@jessetinell.com
            <br />
            <b>Version</b>: {version}
          </p>
        </Stack>

      </Box>
    </>
  );
};

export default Settings;
