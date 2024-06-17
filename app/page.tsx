"use client"
import { useEffect, useState } from 'react';
interface Data {
  message: string;
}

const Home: React.FC = () => {
  const [data, setData] = useState<Data | null>(null);

  useEffect(() => {
    fetch('/api/data')
      .then((response) => response.json())
      .then((data: Data) => setData(data));
  }, []);

  return (
    <div>
      <h1>Next.js with Flask</h1>
      {data ? <p>{data.message}</p> : <p>Loading...</p>}
    </div>
  );
};

export default Home;
