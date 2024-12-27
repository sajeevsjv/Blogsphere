import { useState, useEffect } from "react";
import axios from "axios";
import AdminNavbar from "../components/AdminNavbar";

const AdminDashboard = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const userResponse = await axios({
            url : "http://localhost:3005/getallusers",
            method : "GET",
            headers : {
                "Authorization" : `Bearer ${authToken}`
            }
            
        })

        console.log("userResponse :",userResponse);
        let allusers = userResponse.data.data;
        const filteredUsers = allusers.filter(user => user.user_type !== "67472a35659bfab478d1ef7e");

        setUsers(filteredUsers);
        setTotalUsers(filteredUsers.length);

        // Fetch the list of users

       
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="text-center text-xl text-gray-500">
        Loading dashboard data...
      </div>
    );
  }

  return (
    <>
    <AdminNavbar />
    <div className="admin-dashboard p-6 bg-white shadow-lg rounded-lg">
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Total Users and Blogs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-6">
        {/* Total Users Card */}
        <div className="bg-blue-500 text-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">Total Users</h2>
          <p className="text-3xl font-bold mt-4">{totalUsers}</p>
        </div>

        {/* Total Blogs Card */}
        <div className="bg-green-500 text-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">Total Blogs</h2>
          <p className="text-3xl font-bold mt-4">{totalBlogs}</p>
        </div>
      </div>

      {/* User List */}
      <div className="user-list">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">User List</h2>
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="min-w-full table-auto bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">#</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">User ID</th>
                <th className="px-4 py-2 text-left">Email</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user, index) => (
                  <tr key={user._id} className="border-t">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{user.name}</td>
                    <td className="px-4 py-2">{user._id}</td>
                    <td className="px-4 py-2">{user.email}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-4 py-2 text-center text-gray-400">
                    No users available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </>
  );
};

export default AdminDashboard;
