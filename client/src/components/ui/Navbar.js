import React from 'react';
import { Link } from 'react-router-dom';
import { UserButton, useUser } from '@clerk/clerk-react';

function Navbar({ isLandingPage = false }) {
  const { isSignedIn } = useUser();

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="w-full py-6 flex items-center justify-between border-b border-indigo-500 lg:border-none">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-indigo-600">
              Taskmanager
            </Link>
          </div>
          <div className="ml-10 space-x-4">
            {isLandingPage ? (
              <>
                <Link
                  to="/login"
                  className="inline-block bg-indigo-500 py-2 px-4 border border-transparent rounded-md text-base font-medium text-white hover:bg-opacity-75"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="inline-block bg-white py-2 px-4 border border-transparent rounded-md text-base font-medium text-indigo-600 hover:bg-indigo-50"
                >
                  Start for free
                </Link>
              </>
            ) : (
              isSignedIn && <UserButton afterSignOutUrl="/" />
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
