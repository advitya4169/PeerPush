import {
  SignInButton,
  SignedIn,
  SignedOut,
  useUser,
} from "@clerk/clerk-react";
import { useEffect } from "react";
import axios from "axios";
import Dashboard from "./Pages/Dashboard";
import pfp1 from "../src/assets/pfp1.png";
import pfp2 from "../src/assets/pfp2.webp";
function App() {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded || !user) return;

    axios.post("http://localhost:5000/api/users/sync", {
      clerkId: user.id,
      username: user.fullName,
      email: user.primaryEmailAddress?.emailAddress,
      avatar: user.imageUrl,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
  }, [user, isLoaded]);

  return (
    <>
      <SignedOut>
        <div className="min-h-screen bg-base-100 relative overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[700px] w-[700px] rounded-full bg-warning/10 blur-[180px]" />

            <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[150px]" />

            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:40px_40px]" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6">
            {/* Navbar */}
            <nav className="h-20 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-black tracking-tight">
                  PeerPush
                </h1>

                <p className="text-xs opacity-50 tracking-[0.2em]">
                  Push each other forward
                </p>
              </div>

              <SignInButton mode="modal">
                <button className="btn btn-warning">
                  Sign In
                </button>
              </SignInButton>
            </nav>

            {/* Hero */}
            <section className="min-h-[80vh] flex items-center">
              <div className="grid lg:grid-cols-2 gap-16 items-center w-full">
                {/* Left */}
                <div>
                  <div className="badge badge-warning badge-outline mb-6">
                    ACCOUNTABILITY REIMAGINED
                  </div>

                  <h1 className="text-6xl lg:text-8xl font-black leading-none tracking-tight">
                    Build
                    <br />
                    Consistency
                    <br />
                    Together
                  </h1>

                  <p className="mt-8 text-xl text-base-content/70 max-w-xl">
                    Get matched with someone pursuing the same goal.
                    Check in every day. Protect a shared streak.
                    Miss once and both pay the price.
                  </p>

                  <div className="mt-10 flex gap-4">
                    <SignInButton mode="modal">
                      <button className="btn btn-warning btn-lg">
                        Start Your Pact
                      </button>
                    </SignInButton>
                  </div>
                </div>

                {/* Right */}
<div>
  <div className="rounded-[36px] border border-base-300 bg-base-200/40 backdrop-blur-xl p-8">

    <div className="text-center">
      <p className="text-xs tracking-[0.4em] opacity-50 mb-4">
        SHARED ACCOUNTABILITY
      </p>

      <h2 className="text-5xl font-black tracking-tight">
        Two People.
      </h2>

      <h2 className="text-5xl font-black tracking-tight text-warning">
        One Streak.
      </h2>

      <p className="mt-4 text-base-content/60 max-w-md mx-auto">
        Every day both partners submit proof of progress.
        Miss a day and the shared streak resets.
      </p>
    </div>

    <div className="divider my-8" />

    <div className="flex items-center justify-center gap-10">

      {/* User */}
      <div className="text-center">
        <div className="avatar placeholder">
          <div className="w-20 rounded-3xl bg-base-300 text-base-content">
            <img src={pfp1} alt="" />
          </div>
        </div>

        <p className="mt-3 text-sm tracking-wider opacity-70">
          YOU
        </p>

        <div className="mt-2 badge badge-success badge-outline">
          CHECKED IN
        </div>
      </div>

      {/* Connection */}
      <div className="flex flex-col items-center">
        <div className="w-24 h-px bg-gradient-to-r from-warning to-primary" />

        <div className="mt-3 text-4xl font-black text-warning">
          17
        </div>

        <div className="text-xs tracking-[0.3em] opacity-50">
          DAYS
        </div>
      </div>

      {/* Partner */}
      <div className="text-center">
        <div className="avatar placeholder">
          <div className="w-20 rounded-3xl bg-base-300 text-base-content">
            <img src={pfp2} alt="" />
          </div>
        </div>

        <p className="mt-3 text-sm tracking-wider opacity-70">
          PARTNER
        </p>

        <div className="mt-2 badge badge-success badge-outline">
          CHECKED IN
        </div>
      </div>

    </div>

    <div className="mt-8 rounded-2xl border border-warning/20 bg-warning/5 p-4">
      <p className="text-center text-sm">
        Shared streaks only survive when both people show up.
      </p>
    </div>

  </div>
</div>
              </div>
            </section>

            {/* Features */}
            <section className="pb-24">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="rounded-[28px] border border-base-300 bg-base-200/40 p-6">
                  <div className="w-10 h-[2px] bg-warning mb-6" />

                  <h3 className="text-xl font-bold">
                    Smart Pairing
                  </h3>

                  <p className="mt-3 text-base-content/60">
                    Match with people pursuing similar goals and commitment levels.
                  </p>
                </div>

                <div className="rounded-[28px] border border-base-300 bg-base-200/40 p-6">
                  <div className="w-10 h-[2px] bg-warning mb-6" />

                  <h3 className="text-xl font-bold">
                    Shared Streaks
                  </h3>

                  <p className="mt-3 text-base-content/60">
                    Progress is connected. One missed day affects both partners.
                  </p>
                </div>

                <div className="rounded-[28px] border border-base-300 bg-base-200/40 p-6">
                  <div className="w-10 h-[2px] bg-warning mb-6" />

                  <h3 className="text-xl font-bold">
                    Daily Proof
                  </h3>

                  <p className="mt-3 text-base-content/60">
                    Every check-in becomes part of a shared record of consistency.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        <Dashboard />
      </SignedIn>
    </>
  );
}

export default App;