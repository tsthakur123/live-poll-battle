import React, { useEffect, useState } from 'react';
import { socket } from '../socket';
import { Button, Typography, Box, CircularProgress } from '@mui/material';
import type { VoteData, PollOption } from '../types';

const PollRoom = ({
  roomId,
  username,
  question
}: {
  roomId: string;
  username: string;
  question: string;
}) => {
  const [votes, setVotes] = useState<VoteData>({ optionA: 0, optionB: 0 });
  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const [active, setActive] = useState(true);
  const [timeLeft, setTimeLeft] = useState<number>(60);

  // Timer and socket handling
  useEffect(() => {
    socket.on('vote-updated', (newVotes: VoteData) => {
      setVotes(newVotes);
    });
    socket.on('poll-ended', () => {
      setActive(false);
    });

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      socket.off('vote-updated');
      socket.off('poll-ended');
      clearInterval(interval);
    };
  }, []);

  const vote = (option: PollOption) => {
    if (hasVoted || !active) return;
    socket.emit('vote', { roomId, username, option });
    setHasVoted(true);
    localStorage.setItem(`voted_${roomId}`, 'true');
  };

  useEffect(() => {
    if (localStorage.getItem(`voted_${roomId}`)) {
      setHasVoted(true);
    }
  }, [roomId]);

  // Extract the poll options (A vs B)
  const match = question.match(/^(\w+)\s?vs\s?(\w+)$/);
  const A = match ? match[1] : 'Option A';
  const B = match ? match[2] : 'Option B';

  return (
    <Box sx={{ padding: 3, textAlign: 'center', maxWidth: 500, margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom>
        Poll: {question}
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: 2 }}>
        Room ID: {roomId}
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: 3 }}>
        Time Left: {timeLeft}s
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => vote('optionA')}
          disabled={hasVoted || !active}
          sx={{ minWidth: 120 }}
        >
          {A}: {votes.optionA}
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => vote('optionB')}
          disabled={hasVoted || !active}
          sx={{ minWidth: 120 }}
        >
          {B}: {votes.optionB}
        </Button>
      </Box>

      {active ? (
        <Box sx={{ marginTop: 3 }}>
          {hasVoted && <Typography variant="body2">You have already voted</Typography>}
        </Box>
      ) : (
        <Typography variant="body2" color="textSecondary" sx={{ marginTop: 3 }}>
          Poll ended
        </Typography>
      )}

      {!active && (
        <CircularProgress sx={{ marginTop: 2 }} />
      )}
    </Box>
  );
};

export default PollRoom;
