import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [totalScans, setTotalScans] = useState(0);
  const [joinDate, setJoinDate] = useState("");
  const [newName, setNewName] =useState("");
  const [currentPassword,setCurrentPassword] =useState("");
  const [newPassword,setNewPassword] =useState("");
  const [showLogoutModal,setShowLogoutModal] =useState(false);

useEffect(() => {
  const fetchProfile = async () => {
    try {
      const userId =
        localStorage.getItem("userId");

      setName(
        localStorage.getItem("name")
      );

      setNewName(
        localStorage.getItem("name")
      );

      setEmail(
        localStorage.getItem("email")
      );

      const profileResponse =
        await fetch(
            `http://localhost:5000/api/auth/profile/${userId}`
        );

        const profileData =
        await profileResponse.json();

        setJoinDate(
        new Date(
            profileData.createdAt
        ).toLocaleDateString()
        );

      const response = await fetch(
        `http://localhost:5000/api/scans/${userId}`
      );

      const data =await response.json();

      console.log(data);

      setTotalScans(data.length);

      if (data.length > 0) {
        setJoinDate(
          new Date(
            data[data.length - 1]
              .createdAt
          ).toLocaleDateString()
        );
      }

    } catch (error) {
      console.log(error);
    }
  };

  fetchProfile();
}, []);

const updateProfile = async () => {
  try {
    const userId =
      localStorage.getItem("userId");

    const response = await fetch(
      `http://localhost:5000/api/auth/profile/${userId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newName,
        }),
      }
    );

    const data =await response.json();

    localStorage.setItem(
      "name",
      data.name
    );

    setName(data.name);

    alert(
      "Profile updated successfully"
    );
  } catch (error) {
    console.log(error);
    alert("Update failed");
  }
};

const changePassword = async () => {
  try {
    const userId =
      localStorage.getItem(
        "userId"
      );

    const response =
      await fetch(
        `http://localhost:5000/api/auth/change-password/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }
      );

    const data =
      await response.json();

    alert(data.message);

    setCurrentPassword("");
    setNewPassword("");

  } catch (error) {
    console.log(error);
    alert(
      "Password update failed"
    );
  }
};


  return (
    <div className="min-h-screen bg-black flex justify-center items-center">

      <div className="bg-gray-900 border border-cyan-500 rounded-3xl p-10 w-[500px]">

        <h1 className="text-4xl font-bold text-cyan-400 text-center mb-8">
          User Profile
        </h1>

        <div className="text-center mb-8">
            <span className="bg-cyan-500 text-black px-4 py-2 rounded-full font-semibold">
                {totalScans} Scans Completed
            </span>
        </div>

        <div className="space-y-5 text-lg">

           <div className="mb-4">
                <label className="text-cyan-400 block mb-2">
                    Name
                </label>

                <input
                    type="text"
                    value={newName}
                    onChange={(e) =>
                    setNewName(e.target.value)
                    }
                    className="w-full bg-black border border-gray-700 rounded-xl p-3 text-white"
                />
            </div>

            <div className="mt-8">
              <h3 className="text-2xl font-bold text-cyan-400 mb-4">
                Change Password
              </h3>

              <input
                type="password"
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) =>
                  setCurrentPassword(
                    e.target.value
                  )
                }
                className="w-full bg-black border border-gray-700 rounded-xl p-3 text-white mb-4"
              />

              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(
                    e.target.value
                  )
                }
                className="w-full bg-black border border-gray-700 rounded-xl p-3 text-white mb-4"
              />

              <button
                onClick={changePassword}
                className="bg-red-500 hover:bg-red-600 px-6 py-3 rounded-xl"
              >
                Update Password
              </button>
            </div>

          <p>
            <span className="text-cyan-400">
              Email:
            </span>{" "}
            {email}
          </p>

          <p>
            <span className="text-cyan-400">
              Total Scans:
            </span>{" "}
            {totalScans}
          </p>

          <p>
            <span className="text-cyan-400">
                Member Since:
            </span>{" "}
            {joinDate || "N/A"}
           </p>

        </div>

        <button
            onClick={updateProfile}
            className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-6 py-3 rounded-xl"
            >
            Save Changes
        </button>

        <button
          onClick={() =>
            navigate("/dashboard")
          }
          className="w-full mt-8 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold py-3 rounded-xl"
        >
          Back to Dashboard
        </button>

      </div>
      
    </div>
  );
}

export default Profile;