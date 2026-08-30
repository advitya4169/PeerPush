# PeerPush

A paired accountability platform where users are matched with a partner based on a shared goal and maintain a **shared streak** through daily check-ins and proof of work.

## Features

* Create solo or partner missions
* Goal-based partner matchmaking
* Daily check-ins with proof of work
* Shared streaks between partners
* Real-time partner updates
* Track mission progress and streaks
* Authentication & user management

## Tech Stack

**Frontend:** React, Tailwind CSS, DaisyUI

**Backend:** Node.js, Express.js, MongoDB

**Auth:** Clerk

**Real-time:** Socket.IO

**Background Jobs:** Inngest

## Run Locally

```bash
git clone https://github.com/advitya4169/peerpush.git
cd peerpush
```

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

Open a **new terminal**:

```bash
cd peerpush/frontend
npm install
npm run dev
```

Create the required `.env` files with your MongoDB, Clerk, Stream, and Inngest credentials.

