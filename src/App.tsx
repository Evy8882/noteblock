import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Index from "./pages/Index.tsx";
import EditFile from "./pages/Edit.tsx";
import CreateBlock from "./pages/CreateBlock.tsx";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/edit/:id" element={<EditFile />} />
        <Route path="/new-block" element={<CreateBlock />} />
      </Routes>
    </Router>
  );
}