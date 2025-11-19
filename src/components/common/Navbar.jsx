import React from 'react';
import { LogOut, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 sticky top-0 z-40 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="sm:hidden p-2 hover:bg-gray-100 rounded-lg">
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Keep Notes</h1>
            <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">
              Welcome back, {user?.name}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="hidden sm:block text-right mr-3">
            <p className="text-sm font-medium text-gray-800">{user?.name}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;