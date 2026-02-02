use crate::models::files::File;
use crate::models::fields::Field;

pub fn update_file_title(file: File, new_title: &str) -> File {
    File {
        id: file.id,
        title: String::from(new_title),
        fields: file.fields,
        last_modified: chrono::Utc::now().to_rfc3339(), 
    }
}

pub fn update_file_fields(file: File, new_fields: Vec<Field>) -> File {
    File {
        id: file.id,
        title: file.title,
        fields: new_fields,
        last_modified: chrono::Utc::now().to_rfc3339(), 
    }
}