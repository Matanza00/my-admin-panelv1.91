import { signIn } from 'next-auth/react';
import { useState } from 'react';
import Image from 'next/image';
import { FaUser, FaLock, FaSignInAlt } from 'react-icons/fa';
import saudipak from '../../../../public/saudipak.png';

export default function SignIn() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignIn = async (e) => {
    e.preventDefault();

    const result = await signIn('credentials', {
      redirect: false,
      identifier,
      password,
    });

    if (result.error) {
      setError(result.error);
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        {/* SaudiPak Logo */}
        <div className="flex justify-center mb-6">
          <Image src={saudipak} alt="SaudiPak Logo" width={180} height={60} />
        </div>

        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Sign In
        </h2>

        <form onSubmit={handleSignIn}>
          <div className="mb-4">
            <label
              htmlFor="identifier"
              className="block text-sm font-medium text-gray-600"
            >
              Username or Email
            </label>
            <div className="relative">
              <input
                id="identifier"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                className="w-full mt-2 p-3 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300"
              />
              <FaUser className="absolute left-3 top-6 text-gray-400 text-lg" />
            </div>
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-600"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full mt-2 p-3 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300"
              />
              <FaLock className="absolute left-3 top-6 text-gray-400 text-lg" />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md transition duration-300 hover:bg-blue-700 flex justify-center items-center"
          >
            <FaSignInAlt className="mr-2" />
            Sign In
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-gray-600 text-sm">
            Forgot your password?{' '}
            <a href="#" className="text-blue-600 hover:underline">
              Reset it here
            </a>
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-6 text-center text-gray-500 text-sm">
        Powered by: <span className="font-semibold text-gray-700">Saudi Pak  © 2024</span>
      </footer>
    </div>
  );
}
