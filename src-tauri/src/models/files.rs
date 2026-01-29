use serde::{Deserialize, Serialize};
use crate::models::fields::Field;

#[derive(Serialize, Deserialize)]
pub struct File {
    pub id: String,
    pub title: String,
    pub fields: Vec<Field>,
    pub last_modified: String,
}