import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import CodeBlocks from '../../hooks/CodeBlocks'; 
function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();
  const { login } = useAuth();   

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      login(response.data.token, response.data.userId);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white relative">
      {/* Left Code Block */}
      <div className="absolute left-0 bottom-[-50px] translate-x-[30px] scale-110">
        <CodeBlocks
          position="items-start"
          codeblock={`#include<stdio.h>\nusing namespace std;\n\nclass solution{\npublic:\nint 3SUM(){\n\n\n\n\n}`}
          backgroundGradient={
            <div className="absolute inset-0 bg-gradient-to-r from dark to-blue-50 via-red-500 to-pink-500 opacity-20"></div>
          }
          codeColor="text-green-400"
        />
      </div>

      {/* Main Login Form */}
      <div className="max-w-md w-full space-y-8 p-8 bg-gray-800 rounded-lg shadow-md z-10">
        <div className="space-y-8">
          <div>
            <h2 className="text-center text-3xl font-extrabold text-gray-100">
              Sign in to your account
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <input
                  type="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-400 text-gray-100 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm bg-gray-700"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <input
                  type="password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-400 text-gray-100 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm bg-gray-700"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign in
              </button>
            </div>
          </form>
          <div className="text-center">
            <Link to="/signup" className="text-indigo-400 hover:text-indigo-300">
              Don't have an account? Sign up
            </Link>
          </div>
        </div>
      </div>

      {/* Right Code Block */}
      <div className="absolute right-0 top-[-50px] translate-x-[200px] scale-110">
        <CodeBlocks
          position="items-end"
          codeblock={`#include<stdio.h>\nusing namespace std;\n\nclass solution{\npublic:\nint cloneGraph(){\n\n\n\n\n}`}
          backgroundGradient={
            <div className="absolute inset-0 bg-gradient-to-r from dark to-blue-50 via-red-500 to-pink-500opacity-20"></div>
          }
          codeColor="text-blue-400"
        />
      </div>
    </div>
  );
}

export default Login;


