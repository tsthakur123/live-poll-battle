import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import { Room, PollOption } from './types';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = 5000;
app.use(cors());

const rooms: Map<string, Room> = new Map();

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('create-room', ({ username, question }: { username: string; question: string }) => {
    const roomId = uuidv4().slice(0, 6);
    const newRoom: Room = {
      question,
      votes: { optionA: 0, optionB: 0 },
      usersVoted: new Set(),
      active: true
    };

    rooms.set(roomId, newRoom);
    socket.join(roomId);
    io.to(roomId).emit('room-created', { roomId, question });

    // Start 60s timer
    newRoom.timer = setTimeout(() => {
      newRoom.active = false;
      io.to(roomId).emit('poll-ended');
    }, 60000);
  });

  socket.on('join-room', ({ roomId }: { roomId: string }) => {
    const room = rooms.get(roomId);
    if (!room) {
      socket.emit('error', 'Room not found');
      return;
    }
    socket.join(roomId);
    socket.emit('room-joined', {
      question: room.question,
      votes: room.votes,
      active: room.active
    });
  });

  socket.on('vote', ({ roomId, username, option }: { roomId: string; username: string; option: PollOption }) => {
    const room = rooms.get(roomId);
    if (!room || !room.active) return;

    if (room.usersVoted.has(username)) {
      socket.emit('error', 'User has already voted');
      return;
    }

    if (option === 'optionA') room.votes.optionA++;
    else if (option === 'optionB') room.votes.optionB++;

    room.usersVoted.add(username);
    io.to(roomId).emit('vote-updated', room.votes);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
