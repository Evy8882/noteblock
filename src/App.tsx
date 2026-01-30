import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Index from "./pages/Index.tsx";
import EditFile from "./pages/Edit.tsx";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/edit" element={<EditFile />} />
      </Routes>
    </Router>
  );
}