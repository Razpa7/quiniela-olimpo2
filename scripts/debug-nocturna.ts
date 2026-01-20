
const API_ENDPOINT = 'https://lottery-api-app.vercel.app/api/lottery';
const API_KEY = 'quiniela-master-key-2026';

async function testApi() {
    try {
        const response = await fetch(API_ENDPOINT, { headers: { 'x-api-key': API_KEY } });
        const data = await response.json();

        if (data.resultados) {
            if (data.resultados.Nacional?.Nocturna) {
                console.log('Nacional Nocturna:', JSON.stringify(data.resultados.Nacional.Nocturna, null, 2));
            } else {
                console.log('No Nacional Nocturna found');
            }

            if (data.resultados.Provincia?.Nocturna) {
                console.log('Provincia Nocturna:', JSON.stringify(data.resultados.Provincia.Nocturna, null, 2));
            } else {
                console.log('No Provincia Nocturna found');
            }
        }

    } catch (error) { console.error(error); }
}

testApi();
