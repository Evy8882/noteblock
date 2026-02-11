use crate::models::files::Block;
use crate::models::fields::Field;

pub fn update_file_title(file: Block, new_title: &str) -> Block {
    Block {
        id: file.id,
        title: String::from(new_title),
        fields: file.fields,
        last_modified: chrono::Utc::now().to_rfc3339(), 
    }
}

pub fn update_file_fields(file: Block, new_fields: Vec<Field>) -> Block {
    Block {
        id: file.id,
        title: file.title,
        fields: new_fields,
        last_modified: chrono::Utc::now().to_rfc3339(), 
    }
}