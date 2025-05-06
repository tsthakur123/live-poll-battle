import { useEffect, useState } from 'react';
import CreateRoom from './components/CreateRoom';
import JoinRoom from './components/JoinRoom';
import PollRoom from './components/PollRoom';
import { TextField, Typography, Box, CircularProgress } from '@mui/material';

function App() {
  const [username, setUsername] = useState('');
  const [roomId, setRoomId] = useState('');
  const [question, setQuestion] = useState('');
  const [votes, setVotes] = useState(0);
  const [inRoom, setInRoom] = useState(false);
  const [loading, setLoading] = useState(false);


  const handleRoomChange = (id: string, q: string) => {
    setRoomId(id);
    setQuestion(q);
    setInRoom(true);
    setLoading(false);
  };

  // Restore from localStorage on first render
  useEffect(() => {
    const savedUsername = localStorage.getItem('poll_username');
    const savedRoomId = localStorage.getItem('poll_roomId');
    const savedQuestion = localStorage.getItem('poll_question');
    const savedVotes = localStorage.getItem(`poll_votes_${roomId}`);
    if (savedVotes) {
      setVotes(JSON.parse(savedVotes));
    }

    if (savedUsername && savedRoomId && savedQuestion) {
      setUsername(savedUsername);
      setRoomId(savedRoomId);
      setQuestion(savedQuestion);
      setInRoom(true);
    }
  }, [roomId]);

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
          <PollRoom roomId={roomId} username={username} question={question} liveVotes={votes}/>
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
