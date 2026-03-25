import React, { useContext, useState } from 'react';

import axios from 'axios';

import { useNavigate, Link } from 'react-router-dom';

import { toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import { DataContext } from '../components/DataProvider';



const Login = () => {

  const navigate = useNavigate();

  const { setIsLoggedIn, setUserName } = useContext(DataContext);



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



    if (!data.email || !data.password) {

      toast.error('Please fill in all fields');

      return;

    }



    try {

      const response = await axios({

        url: `${import.meta.env.VITE_API_URL}/login`,

        method: 'POST',

        headers: {

          'Content-type': 'application/json',

        },

        data,

      });



      const { message, data: userData } = response.data;

      toast.success(message);



      const { token, user_id, user_type, user_name } = userData;

      localStorage.setItem('authToken', token);

      localStorage.setItem('user_id', user_id);

      localStorage.setItem('user_type', user_type);

      if (user_name) {

        localStorage.setItem('user_name', user_name);

        setUserName(user_name);

      } else {

        setUserName('');

      }

      setIsLoggedIn(true);



      setTimeout(() => {

        navigate('/');

      }, 2000);

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



  const inputClass =

    'mt-1.5 w-full rounded-2xl border border-violet-200/80 bg-white/90 px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 shadow-inner focus:border-fuchsia-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/30 dark:border-slate-600 dark:bg-slate-900/80 dark:text-slate-100 dark:placeholder:text-slate-500';



  return (

    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-mesh-light px-4 py-16 dark:bg-mesh-dark">

      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-violet-200/60 bg-white/90 p-8 shadow-glow backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/90 dark:shadow-glow-dark">

        <div

          className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br from-fuchsia-400/40 to-violet-500/30 blur-3xl"

          aria-hidden

        />

        <div

          className="pointer-events-none absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-gradient-to-tr from-cyan-400/30 to-violet-400/20 blur-3xl"

          aria-hidden

        />



        <h2 className="relative text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">

          Welcome <span className="bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent">back</span>

        </h2>

        <p className="relative mt-2 text-sm font-medium text-slate-600 dark:text-slate-400">Log in and jump into the feed.</p>



        <form method="post" action="#" onSubmit={handleLogin} className="relative mt-8 space-y-5">

          <div>

            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="email">

              Email

            </label>

            <input

              className={inputClass}

              name="email"

              id="email"

              type="email"

              autoComplete="email"

              onChange={handleChange}

              value={data.email}

            />

          </div>

          <div>

            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="password">

              Password

            </label>

            <input

              className={inputClass}

              name="password"

              id="password"

              type="password"

              autoComplete="current-password"

              onChange={handleChange}

              value={data.password}

            />

          </div>



          <button

            type="submit"

            className="w-full rounded-full bg-btn-primary py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-btn-primary-hover"

          >

            Let&apos;s go

          </button>

        </form>



        <p className="relative mt-6 text-center text-sm text-slate-600 dark:text-slate-400">

          New here?{' '}

          <Link to="/signup" className="font-bold text-violet-600 underline decoration-2 underline-offset-2 hover:text-fuchsia-600 dark:text-fuchsia-400">

            Create an account

          </Link>

        </p>

      </div>

    </div>

  );

};



export default Login;

