import React, { useState } from 'react';
import { socket } from '../socket';
import { Button, TextField, Typography, Box, CircularProgress } from '@mui/material';

const CreateRoom = ({
  username,
  onRoomCreated
}: {
  username: string;
  onRoomCreated: (id: string, question: string) => void;
}) => {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = () => {
    if (!question) return;
    setLoading(true);

    socket.emit('create-room', { username, question });
    socket.once('room-created', ({ roomId, question }) => {
      setLoading(false);
      onRoomCreated(roomId, question);
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
        Create Poll
      </Typography>
      
      <TextField
        variant="outlined"
        label="Poll Question (e.g. Cats vs Dogs)"
        fullWidth
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        sx={{ marginBottom: 2 }}
      />

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleCreate}
        disabled={!question || loading}
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
          'Create Room'
        )}
      </Button>

      {question === '' && !loading && (
        <Typography variant="body2" sx={{ marginTop: 2, color: 'gray' }}>
          Please enter a poll question.
        </Typography>
      )}
    </Box>
  );
};

export default CreateRoom;
