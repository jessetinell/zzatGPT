#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

#[cfg(target_os = "macos")]
#[macro_use]
extern crate objc;

mod window_custom;
use std::env;
use std::process::Command;

use tauri_plugin_autostart::MacosLauncher;

use tauri::{
    generate_handler, GlobalShortcutManager, LogicalSize, Manager,
    RunEvent, Size, Window, SystemTrayMenu, SystemTray, CustomMenuItem, SystemTrayEvent,SystemTrayMenuItem
};

use window_custom::WindowExt as _;

const IS_DEV: bool = cfg!(debug_assertions);

const TOGGLE_SHORTCUT: &str = if IS_DEV { "Command+2" } else { "Command+3" };
const QUIT_SHORTCUT: &str = "Alt+Q";

#[tauri::command]
fn hide(window: Window) {
    window.hide().unwrap();
}

#[tauri::command]
fn set_height(window: Window, height: i32) {

    // Max height should be something like 80% of the screen height
    // let max_height = 600;

    // If height is set, use it, otherwise use 400
    let final_height = if height > 0 { height } else { 600 };

    window.set_size(Size::new(LogicalSize { width: 630, height: final_height })).unwrap();

}

#[tauri::command]
fn open_link_in_browser(url: &str) {
    #[cfg(target_os = "macos")]
    let _ = Command::new("open").arg(url).spawn();

    #[cfg(not(target_os = "macos"))]
    let _ = Command::new("xdg-open").arg(url).spawn();
}

#[tauri::command]
fn center_window(window: Window) {
    window.center().unwrap();
}

#[tauri::command]
fn show(window: Window) {
    window.show().unwrap();
}

#[tauri::command]
fn get_server_url () -> String {
    if IS_DEV {
        return "http://localhost:5000/v1/chat".to_string();
    }
    else{
        return "https://cloudy-rose-sarong.cyclic.app/v1/chat".to_string();
    }
}


fn main() {
        
    // System tray configuration
    let tray = SystemTray::new().with_menu(
        SystemTrayMenu::new()
            .add_item(
                CustomMenuItem::new("show_zzat", "Show zzatGPT").accelerator(TOGGLE_SHORTCUT),
            )
            .add_native_item(SystemTrayMenuItem::Separator)
            .add_item(CustomMenuItem::new("quit".to_string(), "Quit").accelerator(QUIT_SHORTCUT)),
    );

    let app = tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_autostart::init(MacosLauncher::LaunchAgent, Some(vec!["--flag1", "--flag2"]) /* Autostart the app in launch. arbitrary number of args to pass to your app */))
        .setup(|app| {
            let window = app.get_window("main").unwrap();
            // Use the window shadows plugin
            // window_shadows::set_shadow(&window, true).expect("Unsupported platform!");
            // Use transparent titlebar for macos
            #[cfg(target_os = "macos")]
            window.set_transparent_titlebar(true, true);
            // Move the window to the center of the screen
            // window.center().expect("Cannot move window!");

            // Set activation poicy to Accessory to prevent the app icon from showing on the dock
            app.set_activation_policy(tauri::ActivationPolicy::Accessory);

            window.hide().unwrap();

            // Open dev tools
            #[cfg(debug_assertions)]
            window.open_devtools();
            Ok(())
        })
        // Add the system tray
         .system_tray(tray)
        // Handle system tray events
        .on_system_tray_event(|app, event| match event {
            SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
                "quit" => std::process::exit(0),
                "show_zzat" => {
                    let window = app.get_window("main").unwrap();
                    window.show().unwrap();
                    window.set_focus().unwrap();
                }
                // "preference" => user_open_request(app.app_handle()),
                _ => {}
            },
            _ => {}
        })
        .invoke_handler(generate_handler![
              hide,
              set_height,
              center_window,
              open_link_in_browser,
              show,
              get_server_url,
               ])
        .build(tauri::generate_context!())
        .expect("An error occured while running the app!");

    app.run(|app_handle, e| match e {
        RunEvent::Ready => {

            let app_handle = app_handle.clone();

            // Get the global shortcut manager
            let mut gsm = app_handle.global_shortcut_manager();

            // Register the shortcut to show the app
            let handler = app_handle.clone();
            gsm.register(TOGGLE_SHORTCUT, move || {
                let app_handle = handler.clone();
                let window = app_handle.get_window("main").unwrap();
                if window.is_visible().unwrap() {
                    // Hide the app
                    window.hide().unwrap();
                    window.set_focus().unwrap();
                }
                else{
                    window.show().unwrap();
                    window.set_focus().unwrap();
                }
            })
            .unwrap();

            // Register the shortcut to quit the app
            gsm.register(QUIT_SHORTCUT, || std::process::exit(0))
                .unwrap();

        }
        RunEvent::ExitRequested { api, .. } => api.prevent_exit(),
        _ => {}
    })
}
