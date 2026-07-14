import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import {PieChart,Pie,Cell,Tooltip,Legend,} from "recharts";
import {LineChart,Line,XAxis,YAxis,CartesianGrid} from "recharts";

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
  const [history, setHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [filterRisk, setFilterRisk] = useState("All");
  const [dateFilter, setDateFilter] =useState("all");
  const userName =localStorage.getItem("name");
  const [sortBy, setSortBy] =useState("newest");
  const [topKeywords,setTopKeywords] =useState([]);
  const [trendData, setTrendData] =useState([]);
  const [securityScore, setSecurityScore] =useState(100);
  const [alertMessage,setAlertMessage] =useState("");
  const [showLogoutModal, setShowLogoutModal] =useState(false);
  const [theme, setTheme] =useState(
    localStorage.getItem("theme") ||
    "dark"
  );
  const chartData = [{name: "High Threats",value: highThreats,},
  {
    name: "Medium Threats",
    value: mediumThreats,
  },
  {
    name: "Safe Scans",
    value: safeScans,
  },
];
const COLORS = [
  "#ef4444",
  "#facc15",
  "#22c55e",
];

useEffect(() => {
  localStorage.setItem(
    "theme",
    theme
  );
}, [theme]);

    useEffect(() => {
      const fetchHistory = async () => {
        try {
          const userId =
            localStorage.getItem("userId");

          if (!userId) return;

          const response = await fetch(
            `http://localhost:5000/api/scans/${userId}`
          );

          const data = await response.json();

          const formattedHistory =
            data.map((scan) => ({
              id: scan._id,
              text: scan.text,
              risk: scan.riskLevel,
              result: scan.result,
              date: new Date(
                scan.createdAt
              ).toLocaleString(),
          }));

          setTotalScans(data.length);

          setHighThreats(
            data.filter(
              (scan) =>
                scan.riskLevel
                  .toLowerCase()
                  .includes("high")
            ).length
          );

          setMediumThreats(
            data.filter(
              (scan) =>
                scan.riskLevel
                  .toLowerCase()
                  .includes("medium")
            ).length
          );

          setSafeScans(
            data.filter(
              (scan) =>
                scan.riskLevel
                  .toLowerCase()
                  .includes("low")
            ).length
          );

          setHistory(
            formattedHistory.reverse()
          );

          const keywordCount = {};

          data.forEach((scan) => {
            if (scan.keywords) {
              scan.keywords.forEach(
                (keyword) => {
                  keywordCount[keyword] =
                    (keywordCount[keyword] || 0) + 1;
                }
              );
            }
          });

const sortedKeywords =
  Object.entries(keywordCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

setTopKeywords(sortedKeywords);
const dailyScans = {};

data.forEach((scan) => {
  const day =
    new Date(scan.createdAt)
      .toLocaleDateString("en-US", {
        weekday: "short",
      });

  dailyScans[day] =
    (dailyScans[day] || 0) + 1;
});

const trend = Object.keys(
  dailyScans
).map((day) => ({
  day,
  scans: dailyScans[day],
}));

setTrendData(trend);

const highCount = data.filter(
  (scan) => scan.riskLevel === "High"
).length;

const mediumCount = data.filter(
  (scan) => scan.riskLevel === "Medium"
).length;

let score = 100;

score -= highCount * 5;
score -= mediumCount * 2;

if (score < 0) {
  score = 0;
}

setSecurityScore(score);

if (data.length > 0) {
  const latestScan =
    data[data.length - 1];

  if (
    latestScan.riskLevel ===
    "High"
  ) {
    setAlertMessage(
      "⚠️ ALERT: High Risk Threat Detected"
    );
  } else if (
    latestScan.riskLevel ===
    "Medium"
  ) {
    setAlertMessage(
      "⚠️ Warning: Suspicious Content Detected"
    );
  } else {
    setAlertMessage(
      "✅ No Recent Threats Detected"
    );
  }
}
        } catch (error) {
          console.log(
            "History Load Error:",
            error
          );
        }
      };

      fetchHistory();
    }, []);

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

const deleteScan = async (id) => {
  console.log("Deleting ID:", id);

  try {
    await fetch(
      `http://localhost:5000/api/scans/${id}`,
      {
        method: "DELETE",
      }
    );

    setHistory((prev) =>
      prev.filter((item) => item.id !== id)
    );
  } catch (error) {
    console.log(error);
  }
};

const clearAllHistory = async () => {
  const confirmed = window.confirm(
    "Are you sure you want to delete all scans?"
  );

  if (!confirmed) return;

  try {
    const userId =
      localStorage.getItem("userId");

    await fetch(
      `http://localhost:5000/api/scans/clear/${userId}`,
      {
        method: "DELETE",
      }
    );

    setHistory([]);

    setTotalScans(0);
    setHighThreats(0);
    setMediumThreats(0);
    setSafeScans(0);

  } catch (error) {
    console.log(error);
  }
};

const exportCSV = () => {
  const headers =
    "Content,Risk,Result,Date\n";

  const rows = history
    .map(
      (item) =>
        `"${item.text}","${item.risk}","${item.result}","${item.date}"`
    )
    .join("\n");

  const csvContent =
    headers + rows;

  const blob = new Blob(
    [csvContent],
    {
      type: "text/csv",
    }
  );

  const url =
    window.URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;
  link.download =
    "sentinelx_history.csv";

  link.click();
};

const filteredHistory = history.filter(
  (item) => {
    const matchesSearch =
      item.text
        .toLowerCase()
        .includes(
          searchTerm.toLowerCase()
        );

    const matchesRisk =
      filterRisk === "All" ||
      item.risk
        .toLowerCase()
        .includes(
          filterRisk.toLowerCase()
        );

    let matchesDate = true;

    const scanDate =
      new Date(item.date);

    const today = new Date();

    if (dateFilter === "today") {
      matchesDate =
        scanDate.toDateString() ===
        today.toDateString();
    }

    if (dateFilter === "7days") {
      const sevenDaysAgo =
        new Date();

      sevenDaysAgo.setDate(
        today.getDate() - 7
      );

      matchesDate =
        scanDate >= sevenDaysAgo;
    }

    if (dateFilter === "30days") {
      const thirtyDaysAgo =
        new Date();

      thirtyDaysAgo.setDate(
        today.getDate() - 30
      );

      matchesDate =
        scanDate >= thirtyDaysAgo;
    }

    return (
      matchesSearch &&
      matchesRisk &&
      matchesDate
    );
  }
);

const sortedHistory =
  [...filteredHistory].sort(
    (a, b) => {
      if (sortBy === "newest") {
        return (
          new Date(b.date) -
          new Date(a.date)
        );
      }

      return (
        new Date(a.date) -
        new Date(b.date)
      );
    }
  );

const handleLogout = () => {
  localStorage.removeItem("token");
  navigate("/login");
};

const logout = () => {
  localStorage.clear();
  navigate("/login");
};

const recentActivity =[...history].slice(0, 5);
const highThreatPercentage =
  totalScans > 0
    ? ((highThreats / totalScans) * 100).toFixed(1)
    : 0;

const mediumThreatPercentage =
  totalScans > 0
    ? ((mediumThreats / totalScans) * 100).toFixed(1)
    : 0;

const safePercentage =
  totalScans > 0
    ? ((safeScans / totalScans) * 100).toFixed(1)
    : 0;

  return (
    <div className={
    theme === "dark"
      ? "min-h-screen bg-black text-white"
      : "min-h-screen bg-white text-black"
  }
>
      
      <nav className="flex justify-between items-center px-10 py-6 border-b border-gray-800">
        <div>
          <h1 className="text-3xl font-bold text-cyan-400">
            SentinelX
          </h1>
          <div className="bg-yellow-500 text-black font-bold text-center py-3 rounded-xl mb-8">
            {alertMessage}
          </div>

          <p className="text-gray-400 text-sm">
            Welcome, {userName}
          </p>
        </div>

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
            onClick={() =>
              navigate("/profile")
            }
            className="bg-cyan-500 hover:bg-cyan-400 text-black px-4 py-2 rounded-xl mr-3"
          >
            Profile
          </button>

          <button
            onClick={() =>setShowLogoutModal(true)}
            className="bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>

          <button
            onClick={() =>
              setTheme(
                theme === "dark"
                  ? "light"
                  : "dark"
              )
            }
            className="px-4 py-2 rounded-lg bg-cyan-500 text-black font-bold"
          >
            {theme === "dark"
              ? "☀️ Light Mode"
              : "🌙 Dark Mode"}
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
          SentinelX  
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
      <div>
        <p className="text-4xl font-bold">
          {highThreats}
        </p>

        <p className="text-sm text-gray-400">
          {highThreatPercentage}% of all scans
        </p>
    </div>
    </div>
    <div className="bg-gray-900 border border-yellow-500 rounded-xl p-6 text-center">
      <h3 className="text-yellow-400 text-xl font-bold">
        Medium Risk
      </h3>
      <div>
        <p className="text-4xl font-bold">
          {mediumThreats}
        </p>

        <p className="text-sm text-gray-400">
          {mediumThreatPercentage}% of all scans
        </p>
      </div>
    </div>
    <div className="bg-gray-900 border border-green-500 rounded-xl p-6 text-center">
      <h3 className="text-green-400 text-xl font-bold">
        Safe
      </h3>

      <div>
        <p className="text-4xl font-bold">
          {safeScans}
        </p>

        <p className="text-sm text-gray-400">
          {safePercentage}% of all scans
        </p>
      </div>
    </div>
      <br/>
  </div>
</div>
<br />
<div className="px-10 pb-24">
  <div
  className={`${
    theme === "dark"
      ? "bg-gray-900"
      : "bg-gray-100"
  } border border-cyan-500 rounded-3xl p-8`}
>
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
    date: new Date().toLocaleString(),
  },
  ...prev,
]);
  setTotalScans((prev) => prev + 1);
  if (
      data.riskLevel
        .toLowerCase()
        .includes("high")
    ) {
      setHighThreats(
        (prev) => prev + 1
      );
    }

    else if (
      data.riskLevel
        .toLowerCase()
        .includes("medium")
    ) {
      setMediumThreats(
        (prev) => prev + 1
      );
    }

    else {
      setSafeScans(
        (prev) => prev + 1
      );
    }

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

<div className="bg-gray-900 border border-cyan-500 rounded-3xl p-8 max-w-5xl mx-auto mt-10">
  <h2 className="text-3xl font-bold text-cyan-400 text-center mb-8">
    Threat Analytics
  </h2>

  <div className="space-y-6">

    <div>
      <div className="flex justify-between mb-2">
        <span>High Threats</span>
        <span>{highThreats}</span>
      </div>

      <div className="w-full bg-gray-700 rounded-full h-4">
        <div
          className="bg-red-500 h-4 rounded-full"
          style={{
            width: `${totalScans ? (highThreats / totalScans) * 100 : 0}%`,
          }}
        ></div>
      </div>
    </div>

    <div>
      <div className="flex justify-between mb-2">
        <span>Medium Threats</span>
        <span>{mediumThreats}</span>
      </div>

      <div className="w-full bg-gray-700 rounded-full h-4">
        <div
          className="bg-yellow-500 h-4 rounded-full"
          style={{
            width: `${totalScans ? (mediumThreats / totalScans) * 100 : 0}%`,
          }}
        ></div>
      </div>
    </div>

    <div>
      <div className="flex justify-between mb-2">
        <span>Safe Scans</span>
        <span>{safeScans}</span>
      </div>

      <div className="w-full bg-gray-700 rounded-full h-4">
        <div
          className="bg-green-500 h-4 rounded-full"
          style={{
            width: `${totalScans ? (safeScans / totalScans) * 100 : 0}%`,
          }}
        ></div>
      </div>
    </div>
    
    <div className="bg-gray-900 border border-cyan-500 rounded-3xl p-8 max-w-4xl mx-auto mt-10">
      <h2 className="text-3xl font-bold text-cyan-400 text-center mb-6">
        Threat Analytics Chart
      </h2>

    <div className="flex justify-center">
          <PieChart width={400} height={300}>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              dataKey="value"
              label
            >
              {chartData.map(
                (entry, index) => (
                  <Cell
                    key={index}
                    fill={
                      COLORS[
                        index %
                          COLORS.length
                      ]
                    }
                  />
                )
              )}
            </Pie>

            <Tooltip />
            <Legend />
          </PieChart>
      </div>
    </div>
  </div>
</div>

<br/>
<br/><br/>

<div className="bg-gray-900 border border-cyan-500 rounded-3xl p-8 max-w-4xl mx-auto mt-10">
  <h2 className="text-3xl font-bold text-cyan-400 text-center mb-6">
    Top Threat Keywords
  </h2>
  {topKeywords.map(
    ([keyword, count]) => (
      <div
        key={keyword}
        className="flex justify-between border-b border-gray-700 py-2"
      >
        <span>{keyword}</span>
        <span>{count}</span>
      </div>
    )
  )}
</div>

<br /><br />

<div className="bg-gray-900 border border-cyan-500 rounded-3xl p-8 max-w-4xl mx-auto mt-10 text-center">
  <h2 className="text-3xl font-bold text-cyan-400 mb-4">
    Security Score
  </h2>

  <p className="text-6xl font-bold text-white">
    {securityScore}/100
  </p>

  <p className="mt-4 text-xl">
    {securityScore >= 80
      ? "Excellent Security Posture"
      : securityScore >= 60
      ? "Moderate Risk Detected"
      : "High Risk Activity Detected"}
  </p>
</div>

<div className="bg-gray-900 border border-cyan-500 rounded-3xl p-8 max-w-4xl mx-auto mt-10">
  <h2 className="text-3xl font-bold text-cyan-400 text-center mb-6">
    Recent Activity
  </h2>

  {recentActivity.map(
    (item, index) => (
      <div
        key={index}
        className="border-b border-gray-700 py-3"
      >
        <p>
          <span className="font-bold">
            {item.risk}
          </span>{" "}
          - {item.result}
        </p>
        <p className="text-gray-400 text-sm">
          {item.date}
        </p>
      </div>
    )
  )}
</div>

<br/><br/>

<div className="bg-gray-900 border border-cyan-500 rounded-3xl p-8 max-w-5xl mx-auto mt-10">
  <h2 className="text-3xl font-bold text-cyan-400 text-center mb-6">
    Threat Trend (Last 7 Days)
  </h2>

  <div className="flex justify-center">
    <LineChart
      width={700}
      height={300}
      data={trendData}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="day" />
      <YAxis />
      <Tooltip />
      <Line
        type="monotone"
        dataKey="scans"
        stroke="#06b6d4"
        strokeWidth={3}
      />
    </LineChart>
  </div>
</div>

<br/><br/>

<div className="px-10 pb-24">
  <div className="bg-gray-900 border border-cyan-500 rounded-3xl p-8 max-w-6xl mx-auto">
    <h2 className="text-4xl font-bold text-cyan-400 text-center mb-6">
      Analysis History
    </h2>

<div className="flex gap-4 justify-center mb-6">
  <button
    onClick={() => setFilterRisk("All")}
    className="bg-cyan-500 hover:bg-cyan-600 px-4 py-2 rounded-lg"
  >
    All
  </button>

  <button
    onClick={() => setFilterRisk("High")}
    className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg"
  >
    High
  </button>

  <button
    onClick={() => setFilterRisk("Medium")}
    className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-lg"
  >
    Medium
  </button>

  <button
    onClick={() => setFilterRisk("Low")}
    className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg"
  >
    Low
  </button>
</div>

<div className="flex gap-4 justify-center mb-6">
  <button
    onClick={() =>
      setDateFilter("all")
    }
    className="bg-cyan-500 px-4 py-2 rounded-lg"
  >
    All Time
  </button>

  <button
    onClick={() =>
      setDateFilter("today")
    }
    className="bg-purple-500 px-4 py-2 rounded-lg"
  >
    Today
  </button>

  <button
    onClick={() =>
      setDateFilter("7days")
    }
    className="bg-blue-500 px-4 py-2 rounded-lg"
  >
    Last 7 Days
  </button>

  <button
    onClick={() =>
      setDateFilter("30days")
    }
    className="bg-green-500 px-4 py-2 rounded-lg"
  >
    Last 30 Days
  </button>
</div>

<div className="flex gap-4 justify-center mb-6">
  <button
    onClick={() =>
      setSortBy("newest")
    }
    className="bg-indigo-500 px-4 py-2 rounded-lg"
  >
    Newest First
  </button>

  <button
    onClick={() =>
      setSortBy("oldest")
    }
    className="bg-indigo-700 px-4 py-2 rounded-lg"
  >
    Oldest First
  </button>
</div>

    <button
      onClick={exportCSV}
      className="bg-cyan-500 hover:bg-cyan-400 text-black px-4 py-2 rounded-xl font-semibold"
    >
      Export CSV
    </button>

    <span>        </span>

    <button
      onClick={clearAllHistory}
      className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl font-semibold"
    >
      Clear All
    </button>
      
    <div className="flex flex-col md:flex-row gap-4 mb-6">

  <input
    type="text"
    placeholder="Search content..."
    value={searchTerm}
    onChange={(e) =>
      setSearchTerm(e.target.value)
    }
    className="flex-1 p-3 rounded-xl bg-black border border-gray-700 text-white"
  />

  <select
    value={filterRisk}
    onChange={(e) =>
      setFilterRisk(e.target.value)
    }
    className="p-3 rounded-xl bg-black border border-gray-700 text-white"
  >
    <option value="All">All Risks</option>
    <option value="High">High</option>
    <option value="Medium">Medium</option>
    <option value="Low">Low</option>
  </select>

</div>

    <div className="overflow-x-auto">

      <table className="w-full text-left border-collapse">

        <thead>
          <tr className="border-b border-cyan-500">
            <th className="p-3">Content</th>
            <th className="p-3">Risk</th>
            <th className="p-3">Result</th>
            <th className="p-3">Date & Time</th>
            <th className="p-3">Action</th>

          </tr>
        </thead>
        <tbody>

          {sortedHistory.map((item, index) => (
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

              <td className="p-3">
                {item.date}
              </td>

              <td className="p-3">
                {item.id}
              </td>

              <td className="p-3">
                <button
                  onClick={() =>
                    deleteScan(item.id)
                  }
                  className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-lg"
                >
                  Delete
                </button>
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

{showLogoutModal && (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
    <div className="bg-gray-900 p-8 rounded-3xl text-center">
      <h2 className="text-2xl font-bold text-cyan-400 mb-4">
        Confirm Logout
      </h2>

      <p className="mb-4">
        Are you sure you want to logout?
      </p>

      <button
        onClick={() =>
          setShowLogoutModal(false)
        }
        className="bg-gray-600 px-4 py-2 rounded mr-3"
      >
        Cancel
      </button>

      <button
        onClick={() => {
          localStorage.clear();
          window.location.href = "/login";
        }}
        className="bg-red-500 px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  </div>
)}

  </div>
  );
}
export default App;