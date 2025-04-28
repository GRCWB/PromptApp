import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt obrigatório' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'Você é um assistente que gera sites e aplicativos.' },
          { role: 'user', content: `Crie um site ou app com base nesse pedido: ${prompt}` },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    const data = await response.json();
    const code = data.choices?.[0]?.message?.content;

    return res.status(200).json({ code });
  } catch (error) {
    console.error('Erro ao gerar site:', error);
    return res.status(500).json({ error: 'Erro interno ao gerar site' });
  }
}
