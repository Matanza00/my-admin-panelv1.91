'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  TextField,
  Slide,
  Box,
  Stack,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import Rating from '@mui/material/Rating';
import CloseIcon from '@mui/icons-material/Close';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const labels = {
  0.5: 'Useless',
  1: 'Useless+',
  1.5: 'Poor',
  2: 'Poor+',
  2.5: 'Normal',
  3: 'Normal+',
  3.5: 'Good',
  4: 'Good+',
  4.5: 'Excellent',
  5: 'Excellent+'
};

export default function FeedbackReviewModal({ open, onClose, feedbackComplainId, readOnly = false }) {
  const [rating, setRating] = useState(3);
  const [hover, setHover] = useState(-1);
  const [comments, setComments] = useState('');
  const [satisfied, setSatisfied] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If readOnly, fetch existing review data
    if (readOnly && feedbackComplainId) {
      const fetchReview = async () => {
        try {
          const res = await fetch(`/api/feedback-review/${feedbackComplainId}`);
          const data = await res.json();
          if (res.ok) {
            setRating(data.rating || 3);
            setComments(data.comments || '');
            setSatisfied(data.satisfied || false);
          }
        } catch (err) {
          console.error('Failed to fetch review:', err);
        }
      };
      fetchReview();
    }
  }, [readOnly, feedbackComplainId]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/feedback-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feedbackComplainId,
          rating,
          comments,
          satisfied
        })
      });
      if (res.ok) {
        onClose();
      } else {
        alert('Failed to submit feedback');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog fullScreen open={open} onClose={onClose} TransitionComponent={Transition}>
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={onClose} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h3" component="div">
            Feedback Form
          </Typography>
          {!readOnly && (
            <Button autoFocus color="inherit" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Saving...' : 'Submit'}
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Box p={4}>
        <Stack spacing={4} maxWidth={600} mx="auto">
          <Typography variant="h4">Please rate your satisfaction</Typography>

          <Stack direction="row" alignItems="center" spacing={2}>
            <Rating
              name="hover-feedback"
              value={rating}
              precision={0.5}
              onChange={(event, newValue) => !readOnly && setRating(newValue)}
              onChangeActive={(event, newHover) => !readOnly && setHover(newHover)}
              readOnly={readOnly}
            />
            {rating !== null && <Box>{labels[hover !== -1 ? hover : rating]}</Box>}
          </Stack>

          <TextField
            label="Comments (optional)"
            multiline
            minRows={4}
            fullWidth
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            InputProps={{ readOnly }}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={satisfied}
                onChange={(e) => setSatisfied(e.target.checked)}
                color="primary"
                disabled={readOnly}
              />
            }
            label="Are you satisfied with the Work?"
          />
        </Stack>
      </Box>
    </Dialog>
  );
}
