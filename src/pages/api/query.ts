import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const { query } = req.body;

  // Mock response based on query
  let answer = "Sorry, I don't have information on that.";
  if (typeof query === 'string') {
    if (query.toLowerCase().includes('reliance')) {
      answer = "Reliance Industries is a major Indian conglomerate with interests in energy, petrochemicals, retail, and telecom.";
    } else if (query.toLowerCase().includes('pc jeweller')) {
      answer = "PC Jeweller Q1 results: Revenue increased by 8% year-on-year, with net profit up 5%.";
    } else if (query.toLowerCase().includes('tesla')) {
      answer = "Tesla's stock is volatile. Consider your risk tolerance before buying or selling.";
    }
  }

  res.status(200).json({ result: answer });
}
