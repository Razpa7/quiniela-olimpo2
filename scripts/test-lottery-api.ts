
const API_ENDPOINT = 'https://lottery-api-app.vercel.app/api/lottery';
const API_KEY = 'quiniela-master-key-2026';

async function testApi() {
    console.log('Testing Lottery API...');
    try {
        const response = await fetch(API_ENDPOINT, {
            method: 'GET',
            headers: {
                'x-api-key': API_KEY,
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        });

        console.log(`Status: ${response.status}`);

        if (!response.ok) {
            console.error('Error text:', await response.text());
            return;
        }

        const data = await response.json();
        console.log('API Response Data:');
        console.log(JSON.stringify(data, null, 2));

    } catch (error) {
        console.error('Fetch error:', error);
    }
}

testApi();
