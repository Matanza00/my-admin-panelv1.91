import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { feedbackComplainId, rating, comments, satisfied } = req.body;

    if (!feedbackComplainId) {
      return res.status(400).json({ message: 'Missing feedbackComplainId' });
    }

    try {
      // Create feedback review
      const review = await prisma.feedbackComplainReview.create({
        data: {
          feedbackComplainId: parseInt(feedbackComplainId),
          rating,
          comments,
          satisfied,
        },
      });

      // ✅ Update status of the related feedback complain to 'Resolved'
      await prisma.feedbackComplain.update({
        where: {
          id: parseInt(feedbackComplainId),
        },
        data: {
          status: 'Resolved',
        },
      });

      return res.status(200).json(review);
    } catch (error) {
      console.error('Error creating feedback review:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
