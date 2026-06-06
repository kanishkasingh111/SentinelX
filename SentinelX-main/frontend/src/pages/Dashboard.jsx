import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppBackup from "../App_backup";

function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const token =
      localStorage.getItem("token");

    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  return <AppBackup />;
}

export default Dashboard;