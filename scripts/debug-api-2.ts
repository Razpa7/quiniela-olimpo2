
const API_ENDPOINT = 'https://lottery-api-app.vercel.app/api/lottery';
const API_KEY = 'quiniela-master-key-2026';

async function testApi() {
    try {
        const response = await fetch(API_ENDPOINT, {
            method: 'GET',
            headers: {
                'x-api-key': API_KEY,
            },
            cache: 'no-store',
        });

        const data = await response.json();
        console.log('ROOT KEYS:', Object.keys(data));

        if (data.resultados) {
            console.log('RESULTADOS KEYS:', Object.keys(data.resultados));

            const res = data.resultados;

            if (res.nacional) {
                console.log('NACIONAL keys:', Object.keys(res.nacional));
                // Check content of a draw
                if (res.nacional.nocturna) {
                    console.log('NACIONAL NOCTURNA:', JSON.stringify(res.nacional.nocturna, null, 2));
                }
            }
        }

    } catch (error) {
        console.error('ERROR:', error);
    }
}

testApi();
