import React, { useState } from 'react';
import CreateRoom from './components/CreateRoom';
import JoinRoom from './components/JoinRoom';
import PollRoom from './components/PollRoom';
import { Button, TextField, Typography, Box, CircularProgress } from '@mui/material';

function App() {
  const [username, setUsername] = useState('');
  const [roomId, setRoomId] = useState('');
  const [question, setQuestion] = useState('');
  const [inRoom, setInRoom] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRoomChange = (id: string, q: string) => {
    setRoomId(id);
    setQuestion(q);
    setInRoom(true);
    setLoading(false);
  };

  return (
    <Box sx={{ padding: 3, textAlign: 'center', maxWidth: 600, margin: '0 auto' }}>
      {!inRoom ? (
        <>
          <Typography variant="h5" gutterBottom>
            Enter Your Name:
          </Typography>
          <TextField
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            label="Username"
            variant="outlined"
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          {username && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <CreateRoom
                username={username}
                onRoomCreated={(id, q) => {
                  setLoading(true);
                  handleRoomChange(id, q);
                }}
              />
              <JoinRoom
                username={username}
                onRoomJoined={(id, q) => {
                  setLoading(true);
                  handleRoomChange(id, q);
                }}
              />
            </Box>
          )}
        </>
      ) : (
        <Box>
          <PollRoom roomId={roomId} username={username} question={question} />
        </Box>
      )}

      {loading && (
        <Box sx={{ marginTop: 3 }}>
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
}

export default App;
