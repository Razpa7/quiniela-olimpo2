
const API_ENDPOINT = 'https://lottery-api-app.vercel.app/api/lottery';
const API_KEY = 'quiniela-master-key-2026';

async function testApi() {
    console.log('Testing Lottery API Structure...');
    try {
        const response = await fetch(API_ENDPOINT, {
            method: 'GET',
            headers: {
                'x-api-key': API_KEY,
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        });

        if (!response.ok) {
            console.error('Error text:', await response.text());
            return;
        }

        const data = await response.json();

        // Inspect specific structure for Nacional Nocturna
        if (data && data.nacional) {
            console.log('Nacional keys:', Object.keys(data.nacional));
            if (data.nacional.nocturna) {
                console.log('Nacional Nocturna type:', typeof data.nacional.nocturna);
                console.log('Nacional Nocturna content sample:', JSON.stringify(data.nacional.nocturna, null, 2).slice(0, 200));
            }
        }

        // Check Provincial
        if (data && data.provincial) {
            console.log('Provincial keys:', Object.keys(data.provincial));
            if (data.provincial.nocturna) {
                console.log('Provincial Nocturna content sample:', JSON.stringify(data.provincial.nocturna, null, 2).slice(0, 200));
            }
        }


    } catch (error) {
        console.error('Fetch error:', error);
    }
}

testApi();
