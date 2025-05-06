Live Poll Battle
Real-time voting battles where users can create or join poll rooms and vote on Option A vs Option B in a live competition. Built with Socket.IO, React, and TypeScript.

Features
Create or join a poll room with a unique Room ID

Vote once on either Option A or Option B

Live vote count updates for all users in the room

Poll auto-ends after 60 seconds

Prevents duplicate voting (client-side only)

Tech Stack
Frontend: React + TypeScript + Socket.IO Client

Backend: Node.js + Express + Socket.IO + TypeScript

Communication: WebSockets for real-time updates

Getting Started
1. Clone the repo

git clone https://github.com/tsthakur123/live-poll-battle.git
cd live-poll-battle
2. Install Backend

cd server
npm install
npm run dev   # Runs on http://localhost:5000
3. Install Frontend
cd client
npm install
npm run dev     # Runs on http://localhost:5173
Usage
Enter your name

Create a new poll with a custom question
→ Share the room ID with friends
→ OR join an existing room using the ID

Vote once during the 60-second poll window

See results update in real-time!

Project Structure

live-poll-battle/
├── server/          # Express + Socket.IO backend (TypeScript)
├── client/          # React + TS frontend with socket.io-client
└── README.md