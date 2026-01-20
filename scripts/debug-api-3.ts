
const API_ENDPOINT = 'https://lottery-api-app.vercel.app/api/lottery';
const API_KEY = 'quiniela-master-key-2026';

async function testApi() {
    try {
        const response = await fetch(API_ENDPOINT, { headers: { 'x-api-key': API_KEY } });
        const data = await response.json();

        if (data.resultados) {
            const res = data.resultados;
            console.log('Keys:', Object.keys(res));

            if (res.Nacional) {
                console.log('Nacional Keys:', Object.keys(res.Nacional));
                // Check one
                const keys = Object.keys(res.Nacional);
                if (keys.length > 0) {
                    const firstDraw = res.Nacional[keys[0]];
                    console.log('Draw Type:', typeof firstDraw);
                    console.log('Draw Content:', JSON.stringify(firstDraw, null, 2).slice(0, 300));
                }
            }
        }

    } catch (error) { console.error(error); }
}

testApi();
