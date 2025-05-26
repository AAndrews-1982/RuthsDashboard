import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-yellow-100 border-b border-yellow-300 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Left: Logo/Title */}
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
          Ruth's Chicken Inventory Dashboard
        </h1>

        {/* Right: Desktop Menu OR Hamburger */}
        <div className="flex items-center">
          {/* Desktop Menu */}
          <nav className="hidden sm:flex space-x-6 text-gray-800 font-medium">
            <a href="#" className="hover:text-yellow-700">Inventory</a>
            <a href="#" className="hover:text-yellow-700">Orders</a>
            <a href="#" className="hover:text-yellow-700">Settings</a>
          </nav>

          {/* Hamburger Button (Mobile Only) */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="sm:hidden text-gray-800 ml-4"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <nav className="sm:hidden px-4 pb-4">
          <ul className="flex flex-col space-y-2 text-gray-800 font-medium">
            <li><a href="#" className="hover:text-yellow-700">Inventory</a></li>
            <li><a href="#" className="hover:text-yellow-700">Orders</a></li>
            <li><a href="#" className="hover:text-yellow-700">Settings</a></li>
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;
