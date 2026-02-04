use serde_json::{from_str, to_string_pretty};
use crate::models::settings::Settings;

pub fn get_settings_json() -> Option<Settings> {
    let file_content = match std::fs::read_to_string("../data/settings.json") {
        Ok(content) => content,
        Err(_) => return None,
    };
    let settings = match from_str::<Settings>(file_content.as_str()) {
        Ok(settings) => settings,
        Err(_) => return None,
    };
    Some(settings)
}

pub fn save_settings_json(settings: &Settings) {
    let json_string = match to_string_pretty(settings) {
        Ok(json) => json,
        Err(_) => return,
    };
    if !std::path::Path::new("../data").exists() {
        std::fs::create_dir("../data").expect("Unable to create directory");
    }
    std::fs::write("../data/settings.json", json_string).expect("Unable to write file");
}