use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct Field {
    id: String,
    style: String,
    content: String,
}