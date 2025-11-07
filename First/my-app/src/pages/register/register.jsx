import React, { useState } from "react";
import HarmonyNav from "../../layouts/Navbar";
import { useNavigate } from "react-router-dom";
import { post } from '../../services/apiClient';

const Register = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("user");
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleRedirect = () => {
    if (role === "doctor") navigate("/doctor");
    else if (role === "hospital") navigate("/emergencyreferal");
    else navigate("/user");
  };

  const handleSignIn = async () => {
    try {
  const endpoint = role === 'doctor' ? '/api/doctors/login' : role === 'hospital' ? '/api/hospitals/login' : '/api/patients/login';
  const json = await post(endpoint, { email, password });
      // store token and redirect to role dashboard
      if (json.token) {
        localStorage.setItem('token', json.token);
        localStorage.setItem('role', role);
      }
      // also store returned user/hospital/doctor info if provided
      if (json.hospital) localStorage.setItem('user', JSON.stringify(json.hospital));
      if (json.doctor) localStorage.setItem('user', JSON.stringify(json.doctor));
      if (json.patient) localStorage.setItem('user', JSON.stringify(json.patient));
      if (role === 'doctor') navigate('/doctor-dashboard');
      else if (role === 'hospital') navigate('/hospital-dashboard');
      else navigate('/patient-dashboard');
    } catch (err) {
        if (err && err.status === 401) {
          alert('Login failed: Invalid credentials. If you do not have an account, please sign up.');
        } else {
          alert('Login error: ' + (err.message || err));
        }
    }
  };

  const handleSignUp = async () => {
    try {
  const endpoint = role === 'doctor' ? '/api/doctors/register' : role === 'hospital' ? '/api/hospitals/register' : '/api/patients/register';
  const displayName = name || email.split('@')[0];
  const body = { name: displayName, email, password };
  await post(endpoint, body);
      // auto-login after successful sign-up
      setIsSignUp(false);
      setTimeout(() => handleSignIn(), 200);
    } catch (err) {
      alert('Sign up error: ' + err.message);
    }
  };

  return (
    <>
      <HarmonyNav />
      <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
        <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
          <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
            {/* Role Buttons */}
            <div className="flex justify-center gap-2 mb-4">
              <button
                onClick={() => setRole("doctor")}
                className={`px-4 py-2 rounded-lg font-semibold ${
                  role === "doctor"
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Doctor
              </button>
              <button
                onClick={() => setRole("hospital")}
                className={`px-4 py-2 rounded-lg font-semibold ${
                  role === "hospital"
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Hospital Admin
              </button>
              <button
                onClick={() => setRole("user")}
                className={`px-4 py-2 rounded-lg font-semibold ${
                  role === "user"
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                User
              </button>
            </div>

            <div className="mt-6 flex flex-col items-center">
              <div className="w-full flex-1 mt-4">
                <div className="flex flex-col items-center">
                  <button
                    onClick={handleRedirect}
                    className="w-full max-w-xs font-bold shadow-sm rounded-lg py-3 bg-green-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline"
                  >
                    <div className="bg-white p-2 rounded-full">
                      <svg className="w-4" viewBox="0 0 533.5 544.3">
                        <path
                          d="M533.5 278.4c0-18.5-1.5-37.1-4.7-55.3H272.1v104.8h147c-6.1 33.8-25.7 63.7-54.4 82.7v68h87.7c51.5-47.4 81.1-117.4 81.1-200.2z"
                          fill="#4285f4"
                        />
                        <path
                          d="M272.1 544.3c73.4 0 135.3-24.1 180.4-65.7l-87.7-68c-24.4 16.6-55.9 26-92.6 26-71 0-131.2-47.9-152.8-112.3H28.9v70.1c46.2 91.9 140.3 149.9 243.2 149.9z"
                          fill="#34a853"
                        />
                        <path
                          d="M119.3 324.3c-11.4-33.8-11.4-70.4 0-104.2V150H28.9c-38.6 76.9-38.6 167.5 0 244.4l90.4-70.1z"
                          fill="#fbbc04"
                        />
                        <path
                          d="M272.1 107.7c38.8-.6 76.3 14 104.4 40.8l77.7-77.7C405 24.6 339.7-.8 272.1 0 169.2 0 75.1 58 28.9 150l90.4 70.1c21.5-64.5 81.8-112.4 152.8-112.4z"
                          fill="#ea4335"
                        />
                      </svg>
                    </div>
                    <span className="ml-4">Sign In with Google</span>
                  </button>
                </div>

                <div className="my-12 border-b text-center">
                  <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                    Or sign In with Cartesian E-mail
                  </div>
                </div>

                <div className="mx-auto max-w-xs">
                  {isSignUp && (
                    <input
                      className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                      type="text"
                      placeholder="Full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  )}
                  <input
                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <input
                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    onClick={isSignUp ? handleSignUp : handleSignIn}
                    className="mt-5 tracking-wide font-semibold bg-green-400 text-white w-full py-4 rounded-lg hover:bg-green-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                  >
                    <svg
                      className="w-6 h-6 -ml-2"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                      <circle cx="8.5" cy="7" r="4" />
                      <path d="M20 8v6M23 11h-6" />
                    </svg>
                    <span className="ml-2">{isSignUp ? 'Create account' : 'Sign In'}</span>
                  </button>
                  <div className="mt-3 text-center">
                    <button className="text-sm text-blue-600 underline" onClick={() => setIsSignUp(s => !s)}>{isSignUp ? 'Have an account? Sign in' : 'Create an account'}</button>
                  </div>
                  <p className="mt-6 text-xs text-gray-600 text-center">
                    I agree to abide by Cartesian Kinetics{" "}
                    <a
                      href="#"
                      className="border-b border-gray-500 border-dotted"
                    >
                      Terms of Service
                    </a>{" "}
                    and its{" "}
                    <a
                      href="#"
                      className="border-b border-gray-500 border-dotted"
                    >
                      Privacy Policy
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 bg-green-100 text-center hidden lg:flex">
            <div
              className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
              style={{
                backgroundImage:
                  "url('https://images.pexels.com/photos/7653108/pexels-photo-7653108.jpeg')",
              }}
            ></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
