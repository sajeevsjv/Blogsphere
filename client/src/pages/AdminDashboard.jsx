import { useState, useEffect } from "react";
import axios from "axios";
import AdminNavbar from "../components/AdminNavbar";
import AllBlogs from "../components/AllBlogs";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]); // For search functionality
  const [searchQuery, setSearchQuery] = useState(""); // Search input
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayBlog, setDisplayBlog] = useState(false)
  const navigate = useNavigate();





  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const userResponse = await axios.get("http://localhost:3005/getallusers", {
          headers: { Authorization: `Bearer ${authToken}` },
        });

        console.log("userResponse :", userResponse);
        let allUsers = userResponse.data.data;
        const filtered = allUsers.filter(user => user.user_type !== "67472a35659bfab478d1ef7e");

        setUsers(filtered);
        setFilteredUsers(filtered); // Initialize filtered users
        setTotalUsers(filtered.length);


        const blogResponse = await axios.get("http://localhost:3005/getallblogs", {
          headers: { Authorization: `Bearer ${authToken}` },
        });

        console.log("blogresponse :",blogResponse);


      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    if (query.trim() === "") {
      setFilteredUsers(users);
    } else {
      const searchResults = users.filter(
        user =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user._id.toLowerCase().includes(query)
      );
      setFilteredUsers(searchResults);
    }
  };

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
          <div onClick={()=>{setDisplayBlog(false)}} className="bg-blue-500 admin_card cursor-pointer text-white p-6 rounded-lg">
            <h2 className="text-xl font-semibold">Total Users</h2>
            <p className="text-3xl font-bold mt-4">{totalUsers}</p>
          </div>

          {/* Total Blogs Card */}
          <div onClick={()=>setDisplayBlog(true)} className="bg-green-500 admin_card cursor-pointer text-white p-6 rounded-lg">
            <h2 className="text-xl font-semibold">Total Blogs</h2>
            <p className="text-3xl font-bold mt-4">{totalBlogs}</p>
          </div>
        </div>
        {displayBlog ? <AllBlogs /> : 
            <div className="users-section">
            {/* Search Box */}
            <div className="mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search users by name, email, or ID..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              />
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
                      <th className="px-4 py-2 text-left"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user, index) => (
                        <tr key={user._id} className="border-t hover:bg-sky-300 cursor-pointer">
                          <td className="px-4 py-2">{index + 1}</td>
                          <td onClick={()=>{navigate(`/usersviewpage/${user._id}`)}} className="px-4 py-2">{user.name}</td>
                          <td className="px-4 py-2">{user._id}</td>
                          <td className="px-4 py-2">{user.email}</td>
                          <td className="px-4 py-2">
                            <ion-icon color="red" name="chevron-forward-outline"></ion-icon>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-4 py-2 text-center text-gray-400">
                          No users match your search
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            </div>
        }
       
        


      </div>
    </>
  );
};

export default AdminDashboard;
