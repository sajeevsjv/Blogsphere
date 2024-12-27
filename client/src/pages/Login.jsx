import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const navigate = useNavigate();

  const [data, setData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!data.email || !data.password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const response = await axios({
        url: 'http://localhost:3005/login',
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        data,
      });

      const { message, data: userData } = response.data;
      toast.success(message);

      // Save token and user info to localStorage
      const { token, user_id, user_type } = userData;
      localStorage.setItem('authToken', token);
      localStorage.setItem('user_id', user_id);
      localStorage.setItem('user_type', user_type);

      const admin_user_type = "67472a35659bfab478d1ef7e";
      if (user_type === admin_user_type){
        setTimeout(() => {
          navigate('/admin');
        }, 2000);
      }
      else{
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    } catch (error) {
      if (error.response) {
        const { message } = error.response.data;
        toast.error(message);
      } else {
        console.error('Error:', error);
        toast.error('Something went wrong. Please try again.');
      }
    }
  };

  return (
    <>
      <div
        className="max-w-md mx-auto relative mt-20 border-[1px] overflow-hidden z-10 bg-white p-8 rounded-lg shadow-md before:w-24 before:h-24 before:absolute before:bg-indigo-400 before:rounded-full before:-z-10 before:blur-2xl after:w-32 after:h-32 after:absolute after:bg-sky-400 after:rounded-full after:-z-10 after:blur-3xl after:top-24 after:-right-12"
      >
        <h2 className="text-2xl text-sky-900 font-bold mb-6">Login</h2>

        <form method="post" action="#" onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600" htmlFor="email">
              Email Address
            </label>
            <input
              className="mt-1 p-2 w-full border rounded-md"
              name="email"
              id="email"
              type="email"
              onChange={handleChange}
              value={data.email}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600" htmlFor="password">
              Password
            </label>
            <input
              className="mt-1 p-2 w-full border rounded-md"
              name="password"
              id="password"
              type="password"
              onChange={handleChange}
              value={data.password}
            />
          </div>

          <div className="w-full">
            <button
              className="[background:linear-gradient(144deg,#af40ff,#5b42f3_50%,#00ddeb)] w-full text-white px-4 py-2 font-bold rounded-md hover:opacity-80"
              type="submit"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
