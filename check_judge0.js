const axios = require('axios');

const JUDGE0_URL = 'http://localhost:2358';

async function check() {
    console.log('Checking Judge0 at:', JUDGE0_URL);

    try {
        // 1. Check Languages
        console.log('\n--- Checking Languages ---');
        const langs = await axios.get(`${JUDGE0_URL}/languages`);
        // console.log(`Found ${langs.data.length} languages.`);

        // 2. Test Submission (Python 70 - Python 2)
        console.log('\n--- Testing Python 2 (ID 70) ---');
        try {
            const sub = await axios.post(`${JUDGE0_URL}/submissions?base64_encoded=false&wait=true`, {
                source_code: "print 'hello from python 70'",
                language_id: 70
            });
            console.log('Python 70 Result:', sub.data);
        } catch (e) {
            console.log('Error submitting Python 70:', e.message);
            if (e.response) console.log('Response:', e.response.data);
        }

        // 3. Test Submission (C++ - ID 54)
        console.log('\n--- Testing C++ (ID 54) ---');
        try {
            const sub = await axios.post(`${JUDGE0_URL}/submissions?base64_encoded=false&wait=true`, {
                source_code: "#include <iostream>\nint main() { std::cout << \"hello cpp\"; return 0; }",
                language_id: 54
            });
            console.log('C++ 54 Result:', sub.data);
        } catch (e) {
            console.log('Error submitting C++ 54:', e.message);
            if (e.response) console.log('Response:', e.response.data);
        }

    } catch (error) {
        console.error('Error connecting to Judge0:', error.message);
    }
}

check();
