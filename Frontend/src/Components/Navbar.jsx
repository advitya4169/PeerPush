import { SignOutButton } from "@clerk/clerk-react";
import { LogOut, Users, User } from "lucide-react";

function Navbar() {
  const mode = "partner"; // replace with state later

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
          <div className="flex items-center p-1 rounded-xl bg-base-200 border border-base-300">
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === "solo"
                  ? "bg-base-100 shadow-sm"
                  : "text-base-content/60 hover:text-base-content"
              }`}
            >
              <User className="w-4 h-4" />
              Solo
            </button>

            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === "partner"
                  ? "bg-warning text-warning-content shadow-sm"
                  : "text-base-content/60 hover:text-base-content"
              }`}
            >
              <Users className="w-4 h-4" />
              Partner
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