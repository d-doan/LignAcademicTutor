import React, { useEffect } from 'react';

function App() {
  // Define the function
  const testFlaskConnection = async () => {
    try {
      const response = await fetch('/test');
      const data = await response.json();
      console.log(data); // Or display it in your UI
    } catch (error) {
      console.error('Error fetching from Flask:', error);
    }
  };

  // Trigger on component mount
  useEffect(() => {
    testFlaskConnection();
  }, []);

  return (
    <div>
      <h1>React + Flask Test</h1>
      <button onClick={testFlaskConnection}>Test Connection</button>
    </div>
  );
}

export default App;
