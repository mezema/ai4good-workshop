"use client";

import { PredictHeader } from '@/components/predict/PredictHeader';
import { useState } from 'react';

const PredictPage = () => {
  const [predictions, setPredictions] = useState<{ data: number[], prediction: number }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const data = [
    [4.3, 3.0, 1.1, 0.1],
    [5.8, 4.0, 1.2, 0.2],
    [5.7, 4.4, 1.5, 0.4],
    [5.4, 3.9, 1.3, 0.4],
    [5.1, 3.5, 1.4, 0.3],
    [6.3, 3.3, 6.0, 2.5],
    [5.0, 3.3, 1.4, 0.2],
    [6.7, 3.1, 4.7, 1.5],
    [6.3, 2.5, 5.0, 1.9],
    [5.8, 2.7, 5.1, 1.9]
  ];

  const fetchPredictions = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = '/api/predict';
      const predictions = [];

      for (const record of data) {
        const payload = { features: record };
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const result = await response.json();
        predictions.push({ data: record, prediction: result.predicted_class });
      }

      setPredictions(predictions);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PredictHeader
        githubLink={"https://github.com/mezema/ai4good-workshop"}
        height={56}
        accentColor={"cyan"}
      />
      <div className="w-full text-white p-8 rounded-lg max-w-xl mx-auto text-center">
        <h1 className="mb-6 text-2xl font-bold">Iris Random Forest Classifier</h1>
        <button 
          onClick={fetchPredictions} 
          className={`px-6 py-2 mb-6 rounded ${loading ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-700'} text-white transition-colors duration-300`}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Run Prediction Analysis'}
        </button>
        {error ? (
          <p className="text-red-500 font-bold">Error: {error}</p>
        ) : (
          <table className="w-full text-left table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2">Data</th>
                <th className="px-4 py-2">Prediction</th>
              </tr>
            </thead>
            <tbody>
              {predictions.map((item, index) => (
                <tr key={index} className="bg-gray-800">
                  <td className="border px-4 py-2">{Array.isArray(item.data) ? item.data.join(', ') : 'N/A'}</td>
                  <td className="border px-4 py-2">{item.prediction}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default PredictPage;