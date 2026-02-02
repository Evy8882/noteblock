pub mod controllers;
pub mod models;
use crate::controllers::save_file::{update_file_fields, update_file_title};
use crate::controllers::storage_files::{get_json_data, save_json_data};
use crate::models::fields::Field;
use crate::models::files::File;
use uuid::Uuid;

#[tauri::command]
fn create_file(title: &str) -> String {
    let mut current_files: Vec<File> = match get_json_data() {
        Some(data) => data,
        None => Vec::new(),
    };

    let id = Uuid::new_v4().as_simple().to_string();
    let new_file = File {
        id: id.clone(),
        title: String::from(title),
        fields: Vec::new(),
        last_modified: chrono::Utc::now().to_rfc3339(),
    };
    current_files.push(new_file);
    save_json_data(&current_files);
    id
}

#[tauri::command]
fn get_all_files() -> Vec<File> {
    match get_json_data() {
        Some(data) => data,
        None => return Vec::new(),
    }
}

#[tauri::command]
fn get_file(id: &str) -> Option<File> {
    match get_json_data() {
        Some(data) => {
            for file in data {
                if file.id == id {
                    return Some(file);
                }
            }
            return None;
        }
        None => return None,
    }
}

#[tauri::command(rename_all = "snake_case")]
fn update_file(file_id: &str, new_title: &str, new_fields: Vec<Field>){
    let mut file: File = match get_file(file_id) {
        Some(f) => f,
        None => return,
    };
    file = update_file_title(file, new_title);
    file = update_file_fields(file, new_fields);
    let mut all_files: Vec<File> = match get_json_data() {
        Some(data) => data,
        None => Vec::new(),
    };
    // Salva o arquivo na lista
    for ifile in &mut all_files {
        if ifile.id == file.id {
            *ifile = file;
            break;
        }
    }
    save_json_data(&all_files);
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            create_file,
            get_all_files,
            get_file,
            update_file
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
