import React, { useState } from 'react';

const App = () => {
  const [input, setInput] = useState('');
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);

  // Function to fetch the email from the actual API
  const fetchEmailFromAPI = async (id) => {
    try {
      const response = await fetch(`https://search.rutgers.edu/api/people/details?id=${id}`, {
      method: 'GET',
      headers: {
        'accept': '*/*',
        'accept-language': 'en-US,en;q=0.9',
        'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'connection': 'keep-alive',
      },
    });
      const data = await response.json();
      // Assuming the email is in the response as 'emailAddress'
      return data.emailAddress || 'No email found';
    } catch (error) {
      console.error('Error fetching data:', error);
      return 'Error fetching email';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const idsArray = input.split(',').map(id => id.trim()); // Convert input into an array of IDs
    const newEmails = [];

    for (let id of idsArray) {
      const email = await fetchEmailFromAPI(id);
      newEmails.push(email);
    }

    setEmails([...emails, ...newEmails]); // Add new emails to the current state
    setLoading(false);
  };

  const handleCopy = () => {
    const emailString = emails.join(', ');
    navigator.clipboard.writeText(emailString); // Copy emails to clipboard
    alert('Emails copied to clipboard!');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Email Fetcher</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter IDs, separated by commas"
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Fetch Emails'}
        </button>
      </form>

      {emails.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h3>Generated Emails</h3>
          <textarea
            value={emails.join(', ')}
            readOnly
            rows="5"
            style={{ width: '100%', padding: '10px' }}
          />
          <button onClick={handleCopy} style={{ marginTop: '10px' }}>Copy Emails</button>
        </div>
      )}
    </div>
  );
};

export default App;
