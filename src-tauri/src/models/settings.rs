use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct Settings {
    pub theme: String,
    pub autosave: bool,
    pub language: String,
    pub show_line_numbers: bool,
}