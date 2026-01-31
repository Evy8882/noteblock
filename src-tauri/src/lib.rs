pub mod models;
pub mod controllers;
use crate::models::files::File;
use crate::controllers::storage_files::{get_json_data, save_json_data};
// use crate::models::fields::Field;
use uuid::Uuid;

#[tauri::command]
fn create_file(title: &str) {
    let mut current_files: Vec<File> = match get_json_data() {
        Some(data) => data,
        None => Vec::new(),
    };

    let id = Uuid::new_v4().as_simple().to_string();
    let new_file = File {
        id: id,
        title: String::from(title),
        fields: Vec::new(),
        last_modified: chrono::Utc::now().to_rfc3339(),
    };
    current_files.push(new_file);
    save_json_data(&current_files);
}

#[tauri::command]
fn get_all_files() -> Vec<File> {
    match get_json_data() {
        Some(data) => data,
        None => return Vec::new(),
    }
}


#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            create_file,
            get_all_files,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
