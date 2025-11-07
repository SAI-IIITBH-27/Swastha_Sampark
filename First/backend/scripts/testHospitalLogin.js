import axios from 'axios';

const run = async () => {
  try {
  const res = await axios.post('https://swastha-sampark.onrender.com/api/hospitals/login', { email: 'apollo@example.com', password: 'Apollo2025!' });
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
