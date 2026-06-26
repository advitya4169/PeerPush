import { SignOutButton } from "@clerk/clerk-react";
import { LogOut, Users, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
function Navbar() {
  const mode = "partner"; // replace with state later
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <nav className="sticky top-0 z-50 border-b border-base-300/50 bg-base-100/70 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-warning/10 border border-warning/20 flex items-center justify-center">
            <Users className="w-4 h-4 text-warning" />
          </div>

          <h1 className="font-black text-xl tracking-tight">
            PeerPush
          </h1>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Mode Switcher */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/")}
              className={`btn btn-sm ${location.pathname === "/"
                  ? "btn-warning"
                  : "btn-ghost"
                }`}
            >
              Dashboard
            </button>

            <button
              onClick={() => navigate("/missions")}
              className={`btn btn-sm ${location.pathname.startsWith("/missions")
                  ? "btn-warning"
                  : "btn-ghost"
                }`}
            >
              Missions
            </button>

            <button
              onClick={() => navigate("/history")}
              className={`btn btn-sm ${location.pathname === "/history"
                  ? "btn-warning"
                  : "btn-ghost"
                }`}
            >
              History
            </button>
          </div>

          <div className="h-6 w-px bg-base-300" />

          <SignOutButton>
            <button className="btn btn-sm btn-ghost gap-2 text-base-content/70 hover:text-error">
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </SignOutButton>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;