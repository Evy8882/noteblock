use crate::models::files::File;
use serde_json::to_string_pretty;
use base64::{engine::general_purpose, Engine as _};
use rfd;
use std::error::Error;

pub fn export_as_nbon(file: File) -> Result<String, Box<dyn Error>> {
    // criptografa o json em base 64 e salva com a extensão .nbon em um local escolhido pelo usuário
    let json_string = to_string_pretty(&file)?;
    let filename = format!("{}.nbon", file.title);
    let nbon_content = general_purpose::STANDARD.encode(json_string);
    let filepath = rfd::FileDialog::new()
        .set_file_name(&filename)
        .save_file();
    match filepath {
        Some(path) => {
            std::fs::write(path, nbon_content)?;
            Ok(String::from("File exported successfully"))
        }
        None => Err("File export cancelled".into()),
    }
}

pub fn export_as_txt(file: File) -> Result<String, Box<dyn Error>> {
    let mut content = String::new();
    for field in file.fields {
        content.push_str(&field.content);
        content.push_str("\n");
    }
    let filename = format!("{}.txt", file.title);
    let filepath = rfd::FileDialog::new()
        .set_file_name(&filename)
        .save_file();
    match filepath {
        Some(path) => {
            std::fs::write(path, content)?;
            Ok(String::from("File exported successfully"))
        }
        None => Err("File export cancelled".into()),
    }
}

pub fn export_as_md(file: File) -> Result<String, Box<dyn Error>> {
    let mut content = String::new();
    for field in file.fields {
        match field.style.as_str() {
            "normal" => {
                content.push_str(&field.content);
            },
            "title" => {
                content.push_str(&format!("# {}\n\n", field.content));
            },
            "subtitle" => {
                content.push_str(&format!("## {}\n\n", field.content));
            },
            "bold" => {
                content.push_str(&format!("**{}**", field.content));
            },
            "italic" => {
                content.push_str(&format!("*{}*", field.content));
            },
            "underline" => {
                content.push_str(&format!("<u>{}</u>", field.content));
            },
            _ => {
                content.push_str(&field.content);
            }
        }
        content.push_str("\n\n");
    }
    let filename = format!("{}.md", file.title);
    let filepath = rfd::FileDialog::new()
        .set_file_name(&filename)
        .save_file();
    match filepath {
        Some(path) => {
            std::fs::write(path, content)?;
            Ok(String::from("File exported successfully"))
        },
        None => Err("File export cancelled".into()),
    }
}