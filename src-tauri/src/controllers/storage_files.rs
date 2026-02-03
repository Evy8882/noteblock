use serde_json::{from_str, to_string_pretty};
use crate::models::files::File;

pub fn get_json_data() -> Option<Vec<File>> {
    let file_content = match std::fs::read_to_string("../data/files.json") {
        Ok(content) => content,
        Err(_) => String::from("[]"),
    };

    let data = match from_str::<Vec<File>>(&file_content) {
        Ok(data) => Some(data),
        Err(_) => None,
    };
    data
}

pub fn save_json_data(data: &Vec<File>) {
    let json_string = match to_string_pretty(data) {
        Ok(json) => json,
        Err(_) => return,
    };
    if !std::path::Path::new("../data").exists() {
        std::fs::create_dir("../data").expect("Unable to create directory");
    }
    std::fs::write("../data/files.json", json_string).expect("Unable to write file");
}