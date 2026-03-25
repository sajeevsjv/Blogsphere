import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    let error = '';
    if (name === 'name') {
      if (!value) {
        error = 'Name is required';
      } else if (/\d/.test(value)) {
        error = 'Name cannot contain numbers';
      }
    }
    if (name === 'email') {
      if (!value) {
        error = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        error = 'Invalid email format';
      }
    }
    if (name === 'password') {
      if (!value) {
        error = 'Password is required';
      } else if (value.length < 6) {
        error = 'Password must be at least 6 characters long';
      }
    }
    if (name === 'confirmPassword') {
      if (value !== formData.password) {
        error = 'Passwords do not match';
      }
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: validateField(name, value),
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
      }
    });
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});

      try {
        const response = await axios({
          url: 'http://localhost:3005/signup',
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
          },
          data: formData,
        });

        const message = response.data.message;
        toast.success(message);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } catch (error) {
        if (error.response) {
          const message = error.response.data.message;
          toast.error(message);
        } else {
          console.log('error:', error);
        }
      }
    }
  };

  const inputClass =
    'mt-1.5 w-full rounded-2xl border border-violet-200/80 bg-white/90 px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 shadow-inner focus:border-fuchsia-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/30 dark:border-slate-600 dark:bg-slate-900/80 dark:text-slate-100';

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-mesh-light px-4 py-16 dark:bg-mesh-dark">
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-violet-200/60 bg-white/90 p-8 shadow-glow backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/90 dark:shadow-glow-dark">
        <div className="pointer-events-none absolute -right-12 top-0 h-32 w-32 rounded-full bg-purple-400/30 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -bottom-8 -left-8 h-28 w-28 rounded-full bg-cyan-400/25 blur-3xl" aria-hidden />

        <h2 className="relative text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Join <span className="bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent">BlogSphere</span>
        </h2>
        <p className="relative mt-2 text-sm font-medium text-slate-600 dark:text-slate-400">Takes like 30 seconds. Promise.</p>

        <form onSubmit={handleSubmit} className="relative mt-8 space-y-4">
          <div>
            <label htmlFor="name" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={inputClass}
            />
            {errors.name && <p className="mt-1.5 text-sm font-medium text-rose-500">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="email" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={inputClass}
            />
            {errors.email && <p className="mt-1.5 text-sm font-medium text-rose-500">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={inputClass}
            />
            {errors.password && <p className="mt-1.5 text-sm font-medium text-rose-500">{errors.password}</p>}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Confirm password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={inputClass}
            />
            {errors.confirmPassword && <p className="mt-1.5 text-sm font-medium text-rose-500">{errors.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            className="mt-2 w-full rounded-full bg-btn-primary py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-btn-primary-hover"
          >
            Create my account
          </button>
        </form>

        <p className="relative mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
          Already rolling?{' '}
          <Link to="/login" className="font-bold text-violet-600 underline decoration-2 underline-offset-2 hover:text-fuchsia-600 dark:text-fuchsia-400">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
