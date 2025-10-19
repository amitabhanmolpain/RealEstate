import React from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';

const Dashboard = () => {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-semibold mb-4">Dashboard</h1>
        <div className="bg-white rounded-xl shadow p-6">
          <p className="mb-2">Signed in as:</p>
          <div className="mb-6">
            <p className="font-medium">{user?.displayName || 'Unnamed User'}</p>
            <p className="text-gray-600 text-sm">{user?.email}</p>
            {user?.photoURL && (
              <img src={user.photoURL} alt="avatar" className="w-16 h-16 rounded-full mt-3" />
            )}
          </div>
          <button
            onClick={signOut}
            className="bg-red-300 hover:bg-red-400 text-black font-medium px-4 py-2 rounded-lg"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
