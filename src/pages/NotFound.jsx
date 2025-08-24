import React from 'react';
import { NavLink } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-4">
      <h1 className="text-5xl font-extrabold text-green-600 mb-2">404</h1>
      <h2 className="text-2xl font-bold text-green-800 mb-2">Page Not Found</h2>
      <p className="text-green-800 mb-6 text-center max-w-md text-lg">
        Sorry, the page you are looking for doesn't exist or has been moved.
      </p>
      <NavLink
        to="/"
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-1 text-lg shadow-lg transition"
      >
        Go Home
      </NavLink>
    </div>
  );
};

export default NotFound;