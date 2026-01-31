use serde::{Deserialize, Serialize};
use serde_json::{from_str, to_string_pretty};
use crate::models::files::File;
use crate::models::fields::Field;
use uuid::Uuid;

fn get_json_data() -> Option<Vec<File>> {
    let file_content = match std::fs::read_to_string("data/files.json") {
        Ok(content) => content,
        Err(_) => String::from("[]"),
    };

    let data = match from_str::<Vec<File>>(&file_content) {
        Ok(data) => Some(data),
        Err(_) => None,
    };
    data
}

fn save_json_data(data: &Vec<File>) {
    let json_string = match to_string_pretty(data) {
        Ok(json) => json,
        Err(_) => return,
    }
    std::fs::write("data/files.json", json_string).expect("Unable to write file");
}

#[tauri::command]
fn create_file(file_name: &str) {
    let mut current_files: Vec<File> = match get_json_data() {
        Some(data) => data,
        None => Vec::new(),
    };

    let id = Uuid::new_v4().as_simple().to_string();
    let new_file = File {
        id: id,
        name: String::from(file_name),
        fields: Vec::new(),
    };
    current_files.push(new_file);
    save_json_data(&current_files);
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            create_file,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
