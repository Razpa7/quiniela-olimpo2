const API_ENDPOINT = 'https://lottery-api-app.vercel.app/api/lottery';
const API_KEY = 'quiniela-master-key-2026';

async function testApi() {
    try {
        const response = await fetch(API_ENDPOINT, {
            headers: { 'x-api-key': API_KEY }
        });
        const data = await response.json();
        console.log('Root keys:', Object.keys(data));
        console.log('Success:', data.success);
        console.log('Has resultados:', !!data.resultados);
        if (data.resultados) console.log('Resultados keys:', Object.keys(data.resultados));
    } catch (error) {
        console.error('Error:', error);
    }
}

testApi();
