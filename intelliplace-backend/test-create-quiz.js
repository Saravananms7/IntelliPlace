import 'dotenv/config';
import axios from 'axios';

const BASE = process.env.TEST_API_BASE || 'http://localhost:5000/api';

async function testCreateQuiz() {
  const email = process.env.TEST_COMPANY_EMAIL;
  const password = process.env.TEST_COMPANY_PASSWORD;
  if (!email || !password) {
    console.error(
      'Missing TEST_COMPANY_EMAIL or TEST_COMPANY_PASSWORD. Set them in .env (never commit real credentials).'
    );
    process.exit(1);
  }

  try {
    console.log('Starting test script...');
    const loginRes = await axios.post(`${BASE}/auth/login/company`, {
      email,
      password,
    });
    const token = loginRes.data.token;
    console.log('Logged in successfully. Token length:', token.length);

    const jobRes = await axios.post(
      `${BASE}/jobs`,
      {
        title: 'Test Job',
        description: 'Test',
        type: 'FULL_TIME',
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const job = jobRes.data.data;
    console.log('Using job:', job.id, job.title, job.status);

    if (job.status !== 'CLOSED') {
      console.log('Closing job...');
      await axios.post(
        `${BASE}/jobs/${job.id}/close`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log('Job closed.');
    }

    console.log('Attempting to create quiz...');
    const createRes = await axios.post(
      `${BASE}/jobs/${job.id}/aptitude-test`,
      {
        sections: [{ name: 'Test Section', questions: 1 }],
        cutoff: 50,
        totalQuestions: 1,
        questions: [
          {
            section: 'Test Section',
            questionText: 'What is 2+2?',
            options: ['1', '2', '3', '4'],
            correctIndex: 3,
            marks: 1,
          },
        ],
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    console.log('Quiz creation response:', createRes.data);
  } catch (error) {
    if (error.response) {
      console.error('API Error:', error.response.status, error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

testCreateQuiz();
