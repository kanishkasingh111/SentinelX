import { useState, useEffect} from "react";
import jsPDF from "jspdf";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";

function App() {
  const [threatText, setThreatText] = useState("");
  const [result, setResult] = useState("");
  const [riskLevel, setRiskLevel] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState("");
  const [urlResult, setUrlResult] = useState("");
  const [urlRisk, setUrlRisk] = useState("");
  const [password, setPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [passwordSuggestion, setPasswordSuggestion] = useState("");
  const [passwordScore, setPasswordScore] = useState(0);
  const [totalScans, setTotalScans] = useState(0);
  const [highThreats, setHighThreats] = useState(0);
  const [mediumThreats, setMediumThreats] = useState(0);
  const [safeScans, setSafeScans] = useState(0);
  const [history, setHistory] = useState(() => {
  const savedHistory = localStorage.getItem("sentinelx-history");
  return savedHistory ? JSON.parse(savedHistory) : [];
});
  
  useEffect(() => {
  localStorage.setItem(
    "sentinelx-history",
    JSON.stringify(history)
  );
}, [history]);
  const downloadReport = () => {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text("SentinelX Threat Analysis Report", 20, 20);
  doc.setFontSize(12);
  doc.text(`Threat Status: ${result}`, 20, 40);
  doc.text(`Risk Level: ${riskLevel}`, 20, 50);
  doc.text(`Keywords: ${keywords.join(", ")}`, 20, 60);
  doc.save("SentinelX_Report.pdf");
};

return (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/dashboard" element={<Dashboard />} />
  </Routes>
);

}
export default App;