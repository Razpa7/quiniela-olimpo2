
const API_ENDPOINT = 'https://lottery-api-app.vercel.app/api/lottery';
const API_KEY = 'quiniela-master-key-2026';

async function test() {
    const response = await fetch(API_ENDPOINT, {
        headers: { 'x-api-key': API_KEY }
    });
    const data = await response.json();
    console.log('TOP LEVEL KEYS:', Object.keys(data));
    if (data.resultados) {
        console.log('RESULTADOS KEYS:', Object.keys(data.resultados));
        if (data.resultados.Nacional) {
            console.log('NACIONAL KEYS:', Object.keys(data.resultados.Nacional));
            console.log('NACIONAL FIRST DRAW HEAD:', data.resultados.Nacional[Object.keys(data.resultados.Nacional)[0]].a_la_cabeza);
        }
        if (data.resultados.Provincia) {
            console.log('PROVINCIA KEYS:', Object.keys(data.resultados.Provincia));
            console.log('PROVINCIA FIRST DRAW HEAD:', data.resultados.Provincia[Object.keys(data.resultados.Provincia)[0]].a_la_cabeza);
        }
    }
}

test();
