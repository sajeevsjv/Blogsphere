import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import AdminNavbar from "../components/AdminNavbar";

const UserViewPage = () => {
  const { id } = useParams();
  const userId = id;
  const [userDetails, setUserDetails] = useState(null);
  const [userBlogs, setUserBlogs] = useState([]);
  const [totalComments, setTotalComments] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const authToken = localStorage.getItem("authToken");

        const userResponse = await axios.get(`http://localhost:3005/getsingleuser/${userId}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setUserDetails(userResponse.data.data);

        const blogsResponse = await axios.get(`http://localhost:3005/myblogs/${userId}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setUserBlogs(blogsResponse.data.data);

        // const commentsCount = blogsResponse.data.data.reduce((acc, blog) => acc + blog.comments.length, 0);
        // setTotalComments(commentsCount);

      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
    <AdminNavbar />
    <div className="user-view-page p-6 bg-gray-50 min-h-screen">
      {userDetails && (
        <div className="user-info-box p-6 bg-white shadow-lg rounded-lg mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-white shadow-md text-white p-2 rounded-full text-4xl">
            <img width="48" height="48" src="https://img.icons8.com/pulsar-gradient/48/user.png" alt="user"/>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-800">{userDetails.name}</h2>
              <p className="text-gray-500">User ID: {userDetails._id}</p>
            </div>
          </div>

          <div className="grid py-3 grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2 p-4 hover:-translate-y-1 duration-300 hover:bg-black  bg-gradient-to-r from-sky-300 to-indigo-600 rounded-lg">
              <ion-icon name="mail-outline" className="text-blue-500 text-2xl"></ion-icon>
              <p className="text-white">{userDetails.email}</p>
            </div>
            <div className="flex items-center space-x-2 p-4 hover:-translate-y-1 duration-300 bg-gradient-to-r from-sky-300 to-indigo-600  rounded-lg">
              <ion-icon name="document-text-outline" className="text-green-500 text-2xl"></ion-icon>
              <p className="text-white">Total Blogs: {userBlogs.length}</p>
            </div>
            <div className="flex items-center space-x-2 hover:-translate-y-1 duration-300 p-5 bg-gradient-to-r from-sky-300 to-indigo-600 rounded-lg">
              <ion-icon name="chatbubble-ellipses-outline" className="text-orange-500 text-2xl"></ion-icon>
              <p className="text-white">Total Comments: {totalComments}</p>
            </div>
          </div>
        </div>
      )}

      <div className="user-blogs-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {userBlogs.map((blog) => (
          <div key={blog._id} className="p-4 bg-white shadow rounded-lg hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-gray-800">{blog.title}</h3>
            <p className="text-gray-600 mt-2">{blog.summary}</p>
            <div className="text-sm text-gray-400 mt-4">
              <ion-icon name="time-outline"></ion-icon>
              <span className="ml-2">{new Date(blog.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default UserViewPage;
