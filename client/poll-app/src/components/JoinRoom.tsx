import React, { useState } from 'react';
import { socket } from '../socket';
import { Button, TextField, Typography, Box, CircularProgress } from '@mui/material';

const JoinRoom = ({
  username,
  onRoomJoined
}: {
  username: string;
  onRoomJoined: (id: string, question: string) => void;
}) => {
  const [roomId, setRoomId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleJoin = () => {
    if (!roomId) return;
    setLoading(true);

    socket.emit('join-room', { roomId });
    socket.once('room-joined', ({ question }) => {
      setLoading(false);
      onRoomJoined(roomId, question);
    });
    socket.once('error', (msg) => {
      setLoading(false);
      alert(msg);
    });
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 400,
        margin: '0 auto',
        padding: 3,
        borderRadius: 2,
        boxShadow: 3,
        backgroundColor: 'background.paper',
        textAlign: 'center',
      }}
    >
      <Typography variant="h5" sx={{ marginBottom: 2, fontWeight: 'bold' }}>
        Join Poll
      </Typography>
      
      <TextField
        variant="outlined"
        label="Room ID"
        fullWidth
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        sx={{ marginBottom: 2 }}
      />

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleJoin}
        disabled={!roomId || loading}
        sx={{
          padding: '10px',
          fontWeight: 'bold',
          fontSize: '1.1rem',
          textTransform: 'none',
          borderRadius: 2,
          '&:hover': {
            backgroundColor: '#FE744D',
          },
        }}
      >
        {loading ? (
          <CircularProgress size={24} sx={{ color: 'white' }} />
        ) : (
          'Join Room'
        )}
      </Button>

      {roomId === '' && !loading && (
        <Typography variant="body2" sx={{ marginTop: 2, color: 'gray' }}>
          Please enter a Room ID to join.
        </Typography>
      )}
    </Box>
  );
};

export default JoinRoom;
