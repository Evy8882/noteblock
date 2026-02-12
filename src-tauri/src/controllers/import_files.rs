use crate::models::files::Block;
use crate::models::fields::Field;
use base64::{engine::general_purpose, Engine as _};
use rfd;
use serde_json::from_str;
use std::error::Error;
use std::fs;

pub fn import_file() -> Result<Block, Box<dyn Error>> {
    let filepath = rfd::FileDialog::new()
        .add_filter("Supported Files", &["nbon", "md", "txt"])
        .pick_file();
    match filepath {
        Some(path) => {
            let extension = path.extension().and_then(|ext| ext.to_str()).unwrap_or("");
            match extension {
                "nbon" => import_nbon(path),
                "md" => import_md(path),
                "txt" => import_txt(path),
                _ => Err("Unsupported file format".into()),
            }
        }
        None => Err("File import cancelled".into()),
    }
}

fn import_nbon(path: std::path::PathBuf) -> Result<Block, Box<dyn Error>> {
    let nbon_content = fs::read_to_string(path)?;
    let json_string = general_purpose::STANDARD.decode(nbon_content)?;
    let mut block: Block = from_str(&String::from_utf8(json_string)?)?;
    block.id = uuid::Uuid::new_v4().to_string();
    block.last_modified = chrono::Utc::now().to_rfc3339();
    Ok(block)
}

fn import_md(path: std::path::PathBuf) -> Result<Block, Box<dyn Error>> {
    let md_content = fs::read_to_string(&path)?;
    let mut block = Block {
        id: uuid::Uuid::new_v4().to_string(),
        title: path.file_stem().and_then(|stem| stem.to_str()).unwrap_or("").to_string(),
        fields: Vec::new(),
        last_modified: chrono::Utc::now().to_rfc3339(),
    };
    for line in md_content.lines() {
        let style = if line.starts_with("# ") {
            "title"
        } else if line.starts_with("## ") {
            "subtitle"
        } else if line.starts_with("**") && line.ends_with("**") {
            "bold"
        } else if line.starts_with("*") && line.ends_with("*") {
            "italic"
        } else {
            "normal"
        };
        let content = line.trim_matches(&['#', '*'][..]).to_string();
        block.fields.push(Field { content, style: style.to_string(), id: uuid::Uuid::new_v4().to_string() });
    }
    Ok(block)
}

fn import_txt(path: std::path::PathBuf) -> Result<Block, Box<dyn Error>> {
    let txt_content = fs::read_to_string(&path)?;
    let mut block = Block {
        id: uuid::Uuid::new_v4().to_string(),
        title: path.file_stem().and_then(|stem| stem.to_str()).unwrap_or("").to_string(),
        fields: Vec::new(),
        last_modified: chrono::Utc::now().to_rfc3339(),
    };
    for line in txt_content.lines() {
        block.fields.push(Field { content: line.to_string(), style: "normal".to_string(), id: uuid::Uuid::new_v4().to_string() });
    }
    Ok(block)
}