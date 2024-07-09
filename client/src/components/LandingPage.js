import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './ui/Navbar';

function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar isLandingPage={true} />

      <main>
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              Organize your work <br />
              and life, finally.
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Simplify life for both you and your team. The world's #1 task
              manager and to-do list app.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Link
                  to="/signup"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                >
                  Start for free
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default LandingPage;