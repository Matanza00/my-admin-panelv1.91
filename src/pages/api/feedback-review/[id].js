// pages/api/feedback-review/[id].js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient(); // Initialize Prisma client

export default async function handler(req, res) {
  const { id } = req.query;
  const method = req.method;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ error: 'Invalid FeedbackComplain ID' });
  }

  const feedbackComplainId = parseInt(id);

  if (method === 'GET') {
    try {
      // 1. Check if review already exists
      const existingReview = await prisma.feedbackComplainReview.findUnique({
        where: { feedbackComplainId },
      });

      if (existingReview) {
        return res.status(200).json({ review: existingReview, canReview: false });
      }

      // 2. Check if all job slips for this feedback complain are "Verified & Closed"
      const jobSlips = await prisma.jobSlip.findMany({
        where: {
          feedbackComplain: { id: feedbackComplainId },
          deletedAt: null,
        },
        select: { status: true },
      });

      const allClosed = jobSlips.length > 0 && jobSlips.every(js => js.status === 'Verified & Closed');

      if (!allClosed) {
        return res.status(403).json({ message: 'Feedback form not available until all jobs are closed.', canReview: false });
      }

      return res.status(200).json({ message: 'Ready for feedback.', canReview: true });
    } catch (error) {
      console.error('GET feedback error:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  if (method === 'POST') {
    const { rating, comments, satisfied } = req.body;

    if (!rating || typeof satisfied !== 'boolean') {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      // Prevent duplicate feedback
      const existing = await prisma.feedbackComplainReview.findUnique({
        where: { feedbackComplainId },
      });

      if (existing) {
        return res.status(400).json({ error: 'Feedback already submitted' });
      }

      const review = await prisma.feedbackComplainReview.create({
        data: {
          feedbackComplainId,
          rating,
          comments,
          satisfied,
        },
      });

      return res.status(201).json({ message: 'Feedback submitted', review });
    } catch (error) {
      console.error('POST feedback error:', error);
      return res.status(500).json({ error: 'Could not save feedback' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Method ${method} Not Allowed`);
}
