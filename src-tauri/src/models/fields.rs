use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct Field {
    style: String,
    content: String,
}