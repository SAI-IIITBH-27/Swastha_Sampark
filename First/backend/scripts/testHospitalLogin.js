import axios from 'axios';

const run = async () => {
  try {
  const res = await axios.post('http://localhost:8000/api/hospitals/login', { email: 'apollo@example.com', password: 'Apollo2025!' });
    console.log('Status:', res.status);
    console.log('Data:', res.data);
  } catch (err) {
    if (err.response) {
      console.error('Status:', err.response.status);
      console.error('Data:', err.response.data);
    } else {
      console.error(err.message);
    }
    process.exit(1);
  }
};

run();
