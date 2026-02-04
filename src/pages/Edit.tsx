import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";
import File from "../types/File";
import Field from "../types/Field";
import CloseAlert from "../components/CloseAlert";
import DeleteAlert from "../components/DeleteAlert";

export default function EditFile() {
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState("");
  const [fields, setFields] = useState<Array<Field>>([]);
  const [loading, setLoading] = useState(true);
  const [focusFieldId, setFocusFieldId] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [closeAlertOpen , setCloseAlertOpen] = useState(false);
  const [deleteAlertOpen , setDeleteAlertOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [id]);

  useEffect(() => {
    const new_id = crypto.randomUUID();
    if (fields.length === 0) {
      setFields([{ id: new_id, style: "text", content: "" }]);
      setFocusFieldId(new_id);
    }
  }, [fields]);

  useEffect(() => {
    if (focusFieldId) {
      const fieldExists = fields.some((f) => f.id === focusFieldId);
      if (!fieldExists) {
        setFocusFieldId(null);
      }
    }
  }, [fields, focusFieldId]);

  async function fetchData() {
    setLoading(true);
    if (!id) {
      alert("ID do arquivo não fornecido");
      navigate("/");
      return;
    }
    try {
      const file = await invoke<File>("get_file", { id });
      if (file) {
        setTitle(file.title);
        setFields(file.fields || []);
        if (file.fields && file.fields.length > 0) {
          setFocusFieldId(file.fields[0].id);
        }
      } else {
        alert("Arquivo não encontrado");
        navigate("/");
      }
    } catch (error) {
      alert("Erro ao carregar o arquivo: " + error);
      navigate("/");
    } finally {
      setLoading(false);
    }
  }

  const handleEnterKey = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>, field: Field) => {
      const input = e.target as HTMLInputElement;
      const cursorPos = input.selectionStart ?? 0;
      const index = fields.findIndex((f) => f.id === field.id);

      const before = field.content.slice(0, cursorPos);
      const after = field.content.slice(cursorPos);

      const updatedFields = [...fields];
      updatedFields[index] = { ...field, content: before };

      const newField: Field = {
        id: crypto.randomUUID(),
        style: "text",
        content: after,
      };

      updatedFields.splice(index + 1, 0, newField);

      setTimeout(() => {
        const inputElements =
          document.querySelectorAll<HTMLInputElement>(".field-input");
        const nextInput = Array.from(inputElements).find(
          (el) => el.value === newField.content,
        );
        if (nextInput) {
          nextInput.setSelectionRange(0, 0);
        }
      }, 0);

      setFields(updatedFields);
      setFocusFieldId(newField.id);
    },
    [fields],
  );

  const handleArrowUpKey = useCallback(
    (field: Field) => {
      const index = fields.findIndex((f) => f.id === field.id);
      if (index > 0) {
        setFocusFieldId(fields[index - 1].id);
      }
    },
    [fields],
  );

  const handleArrowDownKey = useCallback(
    (field: Field) => {
      const index = fields.findIndex((f) => f.id === field.id);
      if (index < fields.length - 1) {
        setFocusFieldId(fields[index + 1].id);
      }
    },
    [fields],
  );

  const handleBackspaceAtStart = (field: Field) => {
    const index = fields.findIndex((f) => f.id === field.id);
    const content = field.content;
    if (index === 0) return;
    if (fields.length > 1) {
      const updatedFields = fields.filter((f) => f.id !== field.id);
      const previousField = updatedFields[index - 1];
      const previousFieldSize = previousField.content.length;
      setTimeout(() => {
        const inputElements =
          document.querySelectorAll<HTMLInputElement>(".field-input");
        const prevInput = Array.from(inputElements).find(
          (el) => el.value === previousField.content,
        );
        if (prevInput) {
          prevInput.setSelectionRange(previousFieldSize, previousFieldSize);
        }
      }, 0);
      previousField.content += content;
      setFields(updatedFields);
      if (index > 0) {
        setFocusFieldId(fields[index - 1].id);
      } else if (updatedFields.length > 0) {
        setFocusFieldId(updatedFields[0].id);
      }
    }
  };

  const handleDeleteAtEnd = (field: Field) => {
    const index = fields.findIndex((f) => f.id === field.id);
    const content = field.content;
    if (index === fields.length - 1) return;
    if (fields.length > 1) {
      const updatedFields = fields.filter((f) => f.id !== field.id);
      const nextField = updatedFields[index];
      setTimeout(() => {
        const inputElements =
          document.querySelectorAll<HTMLInputElement>(".field-input");
        const nextInput = Array.from(inputElements).find(
          (el) => el.value === nextField.content,
        );
        if (nextInput) {
          nextInput.setSelectionRange(content.length, content.length);
        }
      }, 0);
      nextField.content = content + nextField.content;
      setFields(updatedFields);
      setFocusFieldId(nextField.id);
    }
  };

  const handleFieldKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>, field: Field) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleEnterKey(e, field);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        handleArrowUpKey(field);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        handleArrowDownKey(field);
      } else if (
        e.key === "Backspace" &&
        (e.target as HTMLInputElement).selectionStart === 0 &&
        (e.target as HTMLInputElement).selectionEnd === 0
      ) {
        e.preventDefault();
        handleBackspaceAtStart(field);
      } else if (
        e.key === "Delete" &&
        (e.target as HTMLInputElement).selectionStart ===
          field.content.length &&
        (e.target as HTMLInputElement).selectionEnd === field.content.length
      ) {
        e.preventDefault();
        handleDeleteAtEnd(field);
      }
    },
    [handleEnterKey, handleArrowUpKey, handleArrowDownKey, fields],
  );

  async function handleSave() {
    try {
      await invoke("update_file", {
        file_id: id,
        new_title: title,
        new_fields: fields,
      });

      setDropdownOpen(false);
      // navigate("/");
    } catch (error) {
      alert("Erro ao salvar o arquivo: " + error);
    }
  }

  if (loading) {
    return <div className="container dark-theme">Carregando...</div>;
  }

  return (
    <div className="container dark-theme">
      <CloseAlert
        open={closeAlertOpen}
        onConfirm={() => {
          setCloseAlertOpen(false);
          navigate("/");
        }}
        onCancel={() => setCloseAlertOpen(false)}
      />
      <DeleteAlert
        open={deleteAlertOpen}
        onConfirm={() => {
          setDeleteAlertOpen(false);
          navigate("/");
        }}
        onCancel={() => setDeleteAlertOpen(false)}
      />
      <header>
        <div className="menu-contain">
          <div className="dropdown">
            <button
              className="dropdown-toggle"
              onClick={() => setDropdownOpen((open) => !open)}
            >
              Arquivo ▼
            </button>
            {dropdownOpen && (
              <div className="dropdown-menu">
                <button onClick={handleSave}>Salvar</button>
                <button
                  onClick={() => {
                    navigate("/");
                  }}
                >
                  Salvar como...
                </button>
                <button
                  onClick={() => {
                    setCloseAlertOpen(true);
                  }}
                >
                  Fechar
                </button>
                <button
                  className="danger-btn"
                  onClick={() => {
                    setDeleteAlertOpen(true);
                  }}
                >
                  Excluir
                </button>
              </div>
            )}
          </div>
        </div>
        <h1>Editar arquivo:</h1>
      </header>
      <div className="edit-file-form">
        <label htmlFor="file-title">Título do arquivo:</label>
        <input
          type="text"
          id="file-title"
          name="file-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="style-menu">
          <button
            className={`style-btn${fields.length && fields[focusFieldId ? fields.findIndex((f) => f.id === focusFieldId) : 0]?.style === "text" ? " selected" : ""}`}
            onClick={() => {
              if (focusFieldId) {
          setFields(
            fields.map((f) =>
              f.id === focusFieldId ? { ...f, style: "text" } : f,
            ),
          );
              }
            }}
            type="button"
          >
            Normal
          </button>
          <button
            className={`style-btn${fields.length && fields[focusFieldId ? fields.findIndex((f) => f.id === focusFieldId) : 0]?.style === "bold" ? " selected" : ""}`}
            onClick={() => {
              if (focusFieldId) {
          setFields(
            fields.map((f) =>
              f.id === focusFieldId ? { ...f, style: "bold" } : f,
            ),
          );
              }
            }}
            type="button"
            style={{ fontWeight: "bold" }}
          >
            Negrito
          </button>
          <button
            className={`style-btn${fields.length && fields[focusFieldId ? fields.findIndex((f) => f.id === focusFieldId) : 0]?.style === "italic" ? " selected" : ""}`}
            onClick={() => {
              if (focusFieldId) {
          setFields(
            fields.map((f) =>
              f.id === focusFieldId ? { ...f, style: "italic" } : f,
            ),
          );
              }
            }}
            type="button"
            style={{ fontStyle: "italic" }}
            >
            Itálico
          </button>
          <button
            className={`style-btn${fields.length && fields[focusFieldId ? fields.findIndex((f) => f.id === focusFieldId) : 0]?.style === "underline" ? " selected" : ""}`}
            onClick={() => {
              if (focusFieldId) {
          setFields(
            fields.map((f) =>
              f.id === focusFieldId ? { ...f, style: "underline" } : f,
            ),
          );
              }
            }}
            type="button"
            style={{ textDecoration: "underline" }}
          >
            Sublinhado
          </button>
          <button
            className={`style-btn${fields.length && fields[focusFieldId ? fields.findIndex((f) => f.id === focusFieldId) : 0]?.style === "title" ? " selected" : ""}`}
            onClick={() => {
              if (focusFieldId) {
          setFields(
            fields.map((f) =>
              f.id === focusFieldId ? { ...f, style: "title" } : f,
            ),
          );
              }
            }}
            type="button"
            style={{ fontSize: "1.2rem", fontWeight: "bold" }}
          >
            Título
          </button>
          <button
            className={`style-btn${fields.length && fields[focusFieldId ? fields.findIndex((f) => f.id === focusFieldId) : 0]?.style === "subtitle" ? " selected" : ""}`}
            onClick={() => {
              if (focusFieldId) {
          setFields(
            fields.map((f) =>
              f.id === focusFieldId ? { ...f, style: "subtitle" } : f,
            ),
          );
              }
            }}
            type="button"
            style={{ fontSize: "1.1rem", fontWeight: "bold" }}
          >
            Subtítulo
          </button>
        </div>
        <label htmlFor="file-content">Conteúdo do arquivo:</label>
        <div>
          {fields.map((field) => (
            <input
              key={field.id}
              type="text"
              value={field.content}
              className={"field-input" + ` ${field.style}-input`}
              onChange={(e) => {
                setFields(
                  fields.map((f) =>
                    f.id === field.id ? { ...f, content: e.target.value } : f,
                  ),
                );
              }}
              ref={(el) => {
                if (el && field.id === focusFieldId) {
                  el.focus();
                }
              }}
              onKeyDown={(e) => handleFieldKeyDown(e, field)}
              onFocus={() => setFocusFieldId(field.id)}
            />
          ))}
        </div>
        <button onClick={handleSave} className="confirm-btn little-btn-right">
          Salvar
        </button>
      </div>
    </div>
  );
}
