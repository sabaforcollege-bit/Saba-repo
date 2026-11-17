import { NavLink } from "react-router-dom";

export function Navbar() {
    const linkClass = ({ isActive }: { isActive: boolean }) =>
        `px-4 py-2 rounded-lg font-medium transition-colors ${isActive
            ? "bg-blue-600 text-white"
            : "text-gray-300 hover:bg-gray-800 hover:text-white"
        }`;

    return (
        <nav className="bg-gray-900 border-b border-gray-800 p-4 sticky top-0 z-50">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
                <span className="text-xl font-bold text-white tracking-wider">
                    MediaHub
                </span>
                <div className="flex gap-2 sm:gap-4">
                    <NavLink to="/" className={linkClass}>
                        Home
                    </NavLink>
                    <NavLink to="/photos" className={linkClass}>
                        Photos
                    </NavLink>
                    <NavLink to="/videos" className={linkClass}>
                        Videos
                    </NavLink>
                    <NavLink to="/games" className={linkClass}>
                        Games
                    </NavLink>
                </div>
            </div>
        </nav>
    );
}