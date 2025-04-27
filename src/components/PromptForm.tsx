'use client';
import { useState } from 'react';

export default function PromptForm() {
  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/generate-site', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    const data = await res.json();
    setGeneratedCode(data.code);
  }

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          type="text"
          placeholder="Descreva o site ou app que deseja"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="p-2 border rounded"
        />
        <button type="submit" className="p-2 bg-blue-500 text-white rounded">Gerar Site/App</button>
      </form>

      {generatedCode && (
        <div className="mt-4 p-4 border rounded bg-gray-100">
          <h2 className="font-bold mb-2">Código Gerado:</h2>
          <pre className="whitespace-pre-wrap">{generatedCode}</pre>
        </div>
      )}
    </div>
  );
}

