import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";

function App() {
  const navigate = useNavigate();
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

const handleLogout = () => {
  localStorage.removeItem("token");
  navigate("/login");
};


  return (
    <div className="min-h-screen bg-black text-white">
      
      <nav className="flex justify-between items-center px-10 py-6 border-b border-gray-800">
        <h1 className="text-3xl font-bold text-cyan-400">
          SentinelX
        </h1>

        <div className="flex items-center space-x-6 text-gray-300">
          <a href="#" className="hover:text-cyan-400">
            Home
          </a>

          <a href="#" className="hover:text-cyan-400">
            Features
          </a>

          <a href="#" className="hover:text-cyan-400">
            Dashboard
          </a>

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>

      </nav>

      <div className="flex flex-col items-center justify-center text-center mt-32 px-4">

        <h2 className="text-6xl font-extrabold text-cyan-400 leading-tight">
          AI-Powered <br /> Cyber Threat Detection
        </h2>

        <p className="text-gray-400 mt-6 max-w-2xl text-lg">
          SentinelX helps users detect phishing messages, scam URLs,
          suspicious content, and cyber threats using Artificial Intelligence.
        </p>

        <button className="mt-10 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-8 py-4 rounded-xl transition duration-300">
  Analyze Threat
</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-10 mt-24 pb-20">

  <div className="bg-gray-900 border border-cyan-500 rounded-2xl p-6 hover:scale-105 transition duration-300">
    <h3 className="text-2xl font-bold text-cyan-400 mb-4">
      Scam Detection
    </h3>

    <p className="text-gray-400">
      Detect phishing messages, fake offers, and scam content using AI analysis.
    </p>
  </div>

  <div className="bg-gray-900 border border-cyan-500 rounded-2xl p-6 hover:scale-105 transition duration-300">
    <h3 className="text-2xl font-bold text-cyan-400 mb-4">
      URL Analysis
    </h3>

    <p className="text-gray-400">
      Analyze suspicious URLs and identify possible phishing websites instantly.
    </p>
  </div>

  <div className="bg-gray-900 border border-cyan-500 rounded-2xl p-6 hover:scale-105 transition duration-300">
    <h3 className="text-2xl font-bold text-cyan-400 mb-4">
      Password Security
    </h3>

    <p className="text-gray-400">
      Check password strength and improve cybersecurity awareness.
    </p>
  </div>
</div>

<div className="px-10 mt-16">
  <h2 className="text-4xl font-bold text-cyan-400 text-center mb-10">
    Security Dashboard
  </h2>
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
    <div className="bg-gray-900 border border-cyan-500 rounded-xl p-6 text-center">
      <h3 className="text-cyan-400 text-xl font-bold">
        Total Scans
      </h3>
      <p className="text-3xl mt-3">
        {totalScans}
      </p>
    </div>
    <div className="bg-gray-900 border border-red-500 rounded-xl p-6 text-center">
      <h3 className="text-red-400 text-xl font-bold">
        High Risk
      </h3>
      <p className="text-3xl mt-3">
        {highThreats}
      </p>
    </div>
    <div className="bg-gray-900 border border-yellow-500 rounded-xl p-6 text-center">
      <h3 className="text-yellow-400 text-xl font-bold">
        Medium Risk
      </h3>
      <p className="text-3xl mt-3">
        {mediumThreats}
      </p>
    </div>
    <div className="bg-gray-900 border border-green-500 rounded-xl p-6 text-center">
      <h3 className="text-green-400 text-xl font-bold">
        Safe
      </h3>

      <p className="text-3xl mt-3">
        {safeScans}
      </p>
    </div>
  </div>
</div>

<div className="px-10 pb-24">
  <div className="bg-gray-900 border border-cyan-500 rounded-3xl p-8 max-w-4xl mx-auto">
    <h2 className="text-4xl font-bold text-cyan-400 text-center mb-6">
      Threat Analyzer
    </h2>
    <p className="text-gray-400 text-center mb-8">
      Paste suspicious messages, emails, or URLs to analyze cyber threats using AI.
    </p>
    <textarea
  placeholder="Paste suspicious content here..."
  value={threatText}
  onChange={(e) => setThreatText(e.target.value)}
  className="w-full h-40 bg-black border border-gray-700 rounded-xl p-4 text-white focus:outline-none focus:border-cyan-400"
  ></textarea>
    <div className="flex justify-center mt-6">
      <button
  onClick={async () => {
    try {
      setLoading(true);
  const response = await fetch("http://localhost:5000/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: threatText,
    }),
  });

  const data = await response.json();

  setResult(data.result);
  setRiskLevel(data.riskLevel);
  setKeywords(data.keywords);
  setLoading(false);
      const userId =
      localStorage.getItem("userId");

    await fetch(
      "http://localhost:5000/api/scans",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          userId,
          text: threatText,
          result: data.result,
          riskLevel: data.riskLevel,
          keywords: data.keywords,
        }),
      }
    );
  setHistory((prev) => [
  {
    text: threatText,
    risk: data.riskLevel,
    result: data.result,
  },
  ...prev,
]);
  setTotalScans((prev) => prev + 1);

  if (data.riskLevel === "High") {
    setHighThreats((prev) => prev + 1);
  }
  else if (data.riskLevel === "Medium") {
    setMediumThreats((prev) => prev + 1);
  }
  else {
    setSafeScans((prev) => prev + 1);
  }

} catch (error) {
  console.log(error);
  setLoading(false);
}
  }}
  className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-8 py-3 rounded-xl transition duration-300"
>
  {loading ? "Analyzing..." : "Analyze Now"}
</button>
    </div>
    {result && (
  <div className="mt-8 bg-black border border-cyan-500 rounded-2xl p-6">

    <h3 className="text-3xl text-cyan-400 font-bold text-center mb-6">
      Threat Analysis Report
    </h3>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      <div className="bg-gray-900 p-5 rounded-xl border border-gray-700">
        <h4 className="text-cyan-400 text-xl font-semibold mb-2">
          Threat Status
        </h4>

        <p className="text-white text-lg">
          {result}
        </p>
      </div>

      <div className="bg-gray-900 p-5 rounded-xl border border-gray-700">
        <h4 className="text-cyan-400 text-xl font-semibold mb-2">
          Risk Level
        </h4>

        <p
        className={`text-lg font-semibold ${
          riskLevel === "High"
            ? "text-red-400"
            : riskLevel === "Medium"
            ? "text-yellow-400"
            : "text-green-400"
        }`}
>
          {riskLevel}
        </p>
              </div>

              <div className="bg-gray-900 p-5 rounded-xl border border-gray-700">
                <h4 className="text-cyan-400 text-xl font-semibold mb-2">
                  Suspicious Keywords
                </h4>

                <p className="text-white">
          {keywords.join(", ")}
        </p>
      </div>

      <div className="bg-gray-900 p-5 rounded-xl border border-gray-700">
        <h4 className="text-cyan-400 text-xl font-semibold mb-2">
          Recommendation
        </h4>

        <p className="text-white">
          {riskLevel === "High"
            ? "Do not click any links or share personal information."
            : riskLevel === "Medium"
            ? "Verify the sender before taking any action."
            : "No immediate threat detected. Stay cautious."}
        </p>
      </div>
    </div>
        <div className="flex justify-center mt-6">
        <button
          onClick={downloadReport}
          className="bg-green-500 hover:bg-green-400 text-black font-semibold px-8 py-3 rounded-xl"
        >
          Download Report
        </button>
      </div>
  </div>
)}
  </div>
</div>

<div className="px-10 pb-24">
  <div className="bg-gray-900 border border-cyan-500 rounded-3xl p-8 max-w-6xl mx-auto">
    <h2 className="text-4xl font-bold text-cyan-400 text-center mb-6">
      Analysis History
    </h2>
    <div className="overflow-x-auto">

      <table className="w-full text-left border-collapse">

        <thead>
          <tr className="border-b border-cyan-500">
            <th className="p-3">Content</th>
            <th className="p-3">Risk</th>
            <th className="p-3">Result</th>
          </tr>
        </thead>
        <tbody>

          {history.map((item, index) => (
            <tr
              key={index}
              className="border-b border-gray-700"
            >
              <td className="p-3">
                {item.text}
              </td>

              <td className="p-3">
                {item.risk}
              </td>

              <td className="p-3">
                {item.result}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</div>

<div className="px-10 pb-24">
  <div className="bg-gray-900 border border-cyan-500 rounded-3xl p-8 max-w-4xl mx-auto mt-10">
    <h2 className="text-4xl font-bold text-cyan-400 text-center mb-6">
      URL Analyzer
    </h2>
    <p className="text-gray-400 text-center mb-8">
      Paste a suspicious URL and analyze its safety.
    </p>
    <input
      type="text"
      placeholder="Enter URL..."
      value={url}
      onChange={(e) => setUrl(e.target.value)}
      className="w-full bg-black border border-gray-700 rounded-xl p-4 text-white"
    />

    <div className="flex justify-center mt-6">
      <button
        onClick={() => {
          if (
            url.includes("@") ||
            url.includes("login") ||
            url.includes("verify")
          ) {
            setUrlResult("Suspicious URL Detected");
            setUrlRisk("High");
          }
          else if (
            url.includes("bank") ||
            url.includes("secure")
          ) {
            setUrlResult("Potentially Risky URL");
            setUrlRisk("Medium");
          }
          else {
            setUrlResult("URL Looks Safe");
            setUrlRisk("Low");
          }
        }}
        className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-8 py-3 rounded-xl"
      >
        Analyze URL
      </button>
    </div>

    {urlResult && (
  <div className="mt-8 bg-black border border-cyan-500 rounded-xl p-5">

    <h3 className="text-2xl text-cyan-400 font-bold text-center mb-4">
      URL Analysis Report
    </h3>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

      <div className="bg-gray-900 p-4 rounded-xl">
        <h4 className="text-cyan-400 font-semibold">
          Status
        </h4>
        <p className="text-white">
          {urlResult}
        </p>
      </div>

      <div className="bg-gray-900 p-4 rounded-xl">
        <h4 className="text-cyan-400 font-semibold">
          Risk Level
        </h4>

        <p
          className={`font-bold ${
            urlRisk === "High"
              ? "text-red-400"
              : urlRisk === "Medium"
              ? "text-yellow-400"
              : "text-green-400"
          }`}
        >
          {urlRisk}
        </p>
      </div>

    </div>

  </div>
)}
  </div>
</div>

<div className="px-10 pb-24">

  <div className="bg-gray-900 border border-cyan-500 rounded-3xl p-8 max-w-4xl mx-auto mt-10">

    <h2 className="text-4xl font-bold text-cyan-400 text-center mb-6">
      Password Strength Checker
    </h2>

    <p className="text-gray-400 text-center mb-8">
      Check how secure your password is.
    </p>

    <input
      type="password"
      placeholder="Enter Password..."
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="w-full bg-black border border-gray-700 rounded-xl p-4 text-white"
    />

    <div className="flex justify-center mt-6">
      <button
        onClick={() => {
        let score = 0;

        if (password.length >= 8) score += 25;
        if (/[A-Z]/.test(password)) score += 25;
        if (/[0-9]/.test(password)) score += 25;
        if (/[^A-Za-z0-9]/.test(password)) score += 25;

        setPasswordScore(score);

        if (score <= 25) {
          setPasswordStrength("Weak");
          setPasswordSuggestion(
            "Add uppercase letters, numbers and symbols."
          );
        }
        else if (score <= 75) {
          setPasswordStrength("Medium");
          setPasswordSuggestion(
            "Add more complexity to strengthen security."
          );
        }
        else {
          setPasswordStrength("Strong");
          setPasswordSuggestion(
            "Excellent password security."
          );
        }
      }}
        className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-8 py-3 rounded-xl"
      >
        Check Password
      </button>
    </div>

    {passwordStrength && (
      <div className="mt-8 bg-black border border-cyan-500 rounded-xl p-5">

        <h3 className="text-2xl text-cyan-400 font-bold text-center mb-4">
          Password Report
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div className="bg-gray-900 p-4 rounded-xl">
            <h4 className="text-cyan-400 font-semibold">
              Strength
            </h4>

            <p
              className={`font-bold ${
                passwordStrength === "Strong"
                  ? "text-green-400"
                  : passwordStrength === "Medium"
                  ? "text-yellow-400"
                  : "text-red-400"
              }`}
            >
              {passwordStrength}
            </p>
          </div>

          <div className="bg-gray-900 p-4 rounded-xl">
          <h4 className="text-cyan-400 font-semibold">
            Score
          </h4>

          <p className="text-white">
            {passwordScore}/100
          </p>
        </div>

          <div className="bg-gray-900 p-4 rounded-xl">
            <h4 className="text-cyan-400 font-semibold">
              Suggestion
            </h4>

            <p className="text-white">
              {passwordSuggestion}
            </p>
          </div>

        </div>

      </div>
    )}
  </div>
</div>
  </div>
  );
}
export default App;