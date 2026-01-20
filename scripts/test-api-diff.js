
async function test() {
    const base = 'http://localhost:3000/api/resultados';

    const resNac = await fetch(`${base}?tipo=Nacional&dias=1`);
    const dataNac = await resNac.json();

    const resPro = await fetch(`${base}?tipo=Provincial&dias=1`);
    const dataPro = await resPro.json();

    console.log('NACIONAL FIRST RESULT:', dataNac.data[0]?.primerPremio);
    console.log('PROVINCIAL FIRST RESULT:', dataPro.data[0]?.primerPremio);
}

test();
