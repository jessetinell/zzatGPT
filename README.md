# zzatGPT
zzatGPT is an app built to look and feel like the Spotlight app for Mac. Built with Tauri.

## Prerequisites
- [Tauri & Rust](https://tauri.app/v1/guides/getting-started/prerequisites)
- [Yarn](https://yarnpkg.com)


## Build Locally

Clone the project

```bash
  git clone https://github.com/jessetinell/zzatGPT
```

Go to the project directory

```bash
  cd zzatGPT
```

Install dependencies

```bash
  cargo install cargo-commander tauri-cli
```

Run the setup script

```bash
  cargo cmd setup
```

Run in dev mode
  ```bash
  cargo cmd dev
  ```

Build production app
  ```bash
  cargo cmd build
  ```


## Generate icons
1. Place app-icon.png in `crates/backend`
2. `cd crates/backend`
3. Run `cargo tauri icon`


## Keybindings
(Not customizable yet)
 - Show zzatGPT in dev mode = Command + 2
 - Show zzatGPT in production = Command + 3


## Acknowledgements
 - [Tauri](https://tauri.app/)
 - [React](https://reactjs.org/)
 - [MUI](https://mui.com/)
 
 ## License
 [MIT © Jesse Tinell](https://github.com/jessetinell/zzatGPT/blob/main/LICENSE)
