use crate::models::files::Block;
use base64::{engine::general_purpose, Engine as _};
use pdf_min::*;
use rfd;
use serde_json::to_string_pretty;
use std::fs::File;
use std::io::Write;
use std::error::Error;

pub fn export_as_nbon(file: Block) -> Result<String, Box<dyn Error>> {
    // criptografa o json em base 64 e salva com a extensão .nbon em um local escolhido pelo usuário
    let json_string = to_string_pretty(&file)?;
    let filename = format!("{}.nbon", file.title);
    let nbon_content = general_purpose::STANDARD.encode(json_string);
    let filepath = rfd::FileDialog::new().set_file_name(&filename).save_file();
    match filepath {
        Some(path) => {
            std::fs::write(path, nbon_content)?;
            Ok(String::from("File exported successfully"))
        }
        None => Err("File export cancelled".into()),
    }
}

pub fn export_as_txt(file: Block) -> Result<String, Box<dyn Error>> {
    let mut content = String::new();
    for field in file.fields {
        content.push_str(&field.content);
        content.push_str("\n");
    }
    let filename = format!("{}.txt", file.title);
    let filepath = rfd::FileDialog::new().set_file_name(&filename).save_file();
    match filepath {
        Some(path) => {
            std::fs::write(path, content)?;
            Ok(String::from("File exported successfully"))
        }
        None => Err("File export cancelled".into()),
    }
}

pub fn export_as_md(file: Block) -> Result<String, Box<dyn Error>> {
    let mut content = String::new();
    for field in file.fields {
        match field.style.as_str() {
            "normal" => {
                content.push_str(&field.content);
            }
            "title" => {
                content.push_str(&format!("# {}\n\n", field.content));
            }
            "subtitle" => {
                content.push_str(&format!("## {}\n\n", field.content));
            }
            "bold" => {
                content.push_str(&format!("**{}**", field.content));
            }
            "italic" => {
                content.push_str(&format!("*{}*", field.content));
            }
            "underline" => {
                content.push_str(&format!("<u>{}</u>", field.content));
            }
            _ => {
                content.push_str(&field.content);
            }
        }
        content.push_str("\n\n");
    }
    let filename = format!("{}.md", file.title);
    let filepath = rfd::FileDialog::new().set_file_name(&filename).save_file();
    match filepath {
        Some(path) => {
            std::fs::write(path, content)?;
            Ok(String::from("File exported successfully"))
        }
        None => Err("File export cancelled".into()),
    }
}

pub fn export_as_pdf(file: Block) -> Result<String, Box<dyn Error>> {
    let mut source = String::from("<html><head><title>");
    source.push_str(&file.title);
    source.push_str("</title></head><body>");
    for field in file.fields {
        match field.style.as_str() {
            "normal" => {
                source.push_str(&field.content);
            }
            "title" => {
                source.push_str(&format!("<h1>{}</h1> <br>", field.content.to_uppercase()));
            }
            "subtitle" => {
                source.push_str(&format!("<h2>{}</h2> <br>", field.content.to_uppercase()));
            }
            "bold" => {
                source.push_str(&format!("<b>{}</b> <br>", field.content));
            }
            "italic" => {
                source.push_str(&format!("<i>{}</i> <br>", field.content));
            }
            "underline" => {
                source.push_str(&format!("<u>{}</u> <br>", field.content));
            }
            _ => {
                source.push_str(&format!("<p>{}</p> <br>", field.content));
            }
        };
        source.push_str("\n");
    }
    source.push_str("</body></html>");
    let mut w = Writer::default();
    w.b.nocomp = true;
    w.line_pad = 8;
    html(&mut w, source.as_bytes());
    w.finish();

    let filename = format!("{}.pdf", file.title);
    let filepath = rfd::FileDialog::new().set_file_name(&filename).save_file();
    match filepath {
        Some(path) => {
            let mut pdf_file = File::create(path)?;
            pdf_file.write_all(&w.b.b)?;
        }
        None => return Err("File export cancelled".into()),
    }

    Ok(String::from("File exported successfully"))
}
