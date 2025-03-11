import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  try {
    const lastGenerator = await prisma.generator.findFirst({
      orderBy: {
        date: 'desc', // Get the latest generator entry
      },
      select: {
        lastHrs: true,
        lastDate: true,
      },
    });

    if (lastGenerator) {
      return res.status(200).json(lastGenerator);
    } else {
      return res.status(404).json({ error: 'No previous generator found' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error fetching last generator' });
  }
}