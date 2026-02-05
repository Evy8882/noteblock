use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct Field {
    pub id: String,
    pub style: String,
    pub content: String,
}