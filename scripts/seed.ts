import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Historical data - Provincial
const provincialData = [
  { fecha: '2026-01-19', laPrevia: '8224', primera: '9580', matutina: '4459', vespertina: '6465', nocturna: null },
  { fecha: '2026-01-17', laPrevia: '4179', primera: '2353', matutina: '6701', vespertina: '8647', nocturna: '7055' },
  { fecha: '2026-01-16', laPrevia: '4455', primera: '3348', matutina: '8639', vespertina: '6590', nocturna: '5886' },
  { fecha: '2026-01-15', laPrevia: '0658', primera: '5273', matutina: '3092', vespertina: '8267', nocturna: '7907' },
  { fecha: '2026-01-14', laPrevia: '4295', primera: '2852', matutina: '2726', vespertina: '1704', nocturna: '0211' },
  { fecha: '2026-01-13', laPrevia: '2593', primera: '9730', matutina: '5600', vespertina: '7326', nocturna: '7600' },
  { fecha: '2026-01-12', laPrevia: '8338', primera: '3594', matutina: '8766', vespertina: '2876', nocturna: '1323' },
  { fecha: '2026-01-10', laPrevia: '6511', primera: '5802', matutina: '7768', vespertina: '9213', nocturna: '2546' },
  { fecha: '2026-01-09', laPrevia: '0643', primera: '2273', matutina: '3488', vespertina: '3024', nocturna: '4113' },
  { fecha: '2026-01-08', laPrevia: '4699', primera: '2777', matutina: '4805', vespertina: '3738', nocturna: '8694' },
  { fecha: '2026-01-07', laPrevia: '2757', primera: '0690', matutina: '6767', vespertina: '3505', nocturna: '4578' },
  { fecha: '2026-01-06', laPrevia: '2565', primera: '8548', matutina: '8567', vespertina: '1236', nocturna: '9900' },
  { fecha: '2026-01-05', laPrevia: '3501', primera: '5140', matutina: '5765', vespertina: '0005', nocturna: '4417' },
  { fecha: '2026-01-03', laPrevia: '1533', primera: '8212', matutina: '0037', vespertina: '1466', nocturna: '0505' },
  { fecha: '2026-01-02', laPrevia: '1971', primera: '1223', matutina: '6449', vespertina: '3206', nocturna: '6321' },
  { fecha: '2025-12-31', laPrevia: '5080', primera: '6529', matutina: null, vespertina: null, nocturna: '6664' },
  { fecha: '2025-12-30', laPrevia: '5538', primera: '6522', matutina: '4102', vespertina: '2566', nocturna: '3276' },
  { fecha: '2025-12-29', laPrevia: '7327', primera: '7486', matutina: '1454', vespertina: '9157', nocturna: '9561' },
  { fecha: '2025-12-27', laPrevia: '7653', primera: '1821', matutina: '4150', vespertina: '4495', nocturna: '0011' },
  { fecha: '2025-12-26', laPrevia: '7094', primera: '8476', matutina: '2262', vespertina: '8928', nocturna: '7222' },
  { fecha: '2025-12-23', laPrevia: '7173', primera: '3903', matutina: '9325', vespertina: '0741', nocturna: '4366' },
  { fecha: '2025-12-22', laPrevia: '0751', primera: '0489', matutina: '9927', vespertina: '1733', nocturna: '3145' },
  { fecha: '2025-12-20', laPrevia: '8959', primera: '0933', matutina: '4017', vespertina: '2118', nocturna: '6700' },
  { fecha: '2025-12-19', laPrevia: '3252', primera: '4149', matutina: '5345', vespertina: '4687', nocturna: '5224' },
  { fecha: '2025-12-18', laPrevia: '5355', primera: '0241', matutina: '5998', vespertina: '6691', nocturna: '3732' },
  { fecha: '2025-12-17', laPrevia: '0910', primera: '4911', matutina: '8506', vespertina: '0420', nocturna: '2859' },
  { fecha: '2025-12-16', laPrevia: '0358', primera: '0896', matutina: '1330', vespertina: '8011', nocturna: '5283' },
  { fecha: '2025-12-15', laPrevia: '3113', primera: '1921', matutina: '7700', vespertina: '4442', nocturna: '9454' },
  { fecha: '2025-12-13', laPrevia: '1420', primera: '3876', matutina: '6290', vespertina: '0031', nocturna: '1177' },
  { fecha: '2025-12-12', laPrevia: '4655', primera: '5599', matutina: '0474', vespertina: '1112', nocturna: '7928' },
  { fecha: '2025-12-11', laPrevia: '4137', primera: '7397', matutina: '6144', vespertina: '2685', nocturna: '5093' },
];

// Historical data - Nacional
const nacionalData = [
  { fecha: '2026-01-19', laPrevia: '9385', primera: '9348', matutina: '1115', vespertina: '2656', nocturna: null },
  { fecha: '2026-01-17', laPrevia: '2422', primera: '2789', matutina: '1710', vespertina: '6433', nocturna: '5797' },
  { fecha: '2026-01-16', laPrevia: '0178', primera: '9590', matutina: '8861', vespertina: '1797', nocturna: '0331' },
  { fecha: '2026-01-15', laPrevia: '4996', primera: '1373', matutina: '8726', vespertina: '2340', nocturna: '5465' },
  { fecha: '2026-01-14', laPrevia: '2497', primera: '8083', matutina: '3953', vespertina: '2158', nocturna: '9504' },
  { fecha: '2026-01-13', laPrevia: '8465', primera: '5465', matutina: '4922', vespertina: '5537', nocturna: '0341' },
  { fecha: '2026-01-12', laPrevia: '5910', primera: '7074', matutina: '8203', vespertina: '9014', nocturna: '2468' },
  { fecha: '2026-01-10', laPrevia: '1803', primera: '6393', matutina: '4724', vespertina: '8603', nocturna: '0352' },
  { fecha: '2026-01-09', laPrevia: '7753', primera: '4614', matutina: '3850', vespertina: '3065', nocturna: '3824' },
  { fecha: '2026-01-08', laPrevia: '3343', primera: '2696', matutina: '3655', vespertina: '1835', nocturna: '7259' },
  { fecha: '2026-01-07', laPrevia: '4493', primera: '8377', matutina: '6012', vespertina: '3493', nocturna: '7739' },
  { fecha: '2026-01-06', laPrevia: '0077', primera: '1439', matutina: '3782', vespertina: '0891', nocturna: '6303' },
  { fecha: '2026-01-05', laPrevia: '9042', primera: '0925', matutina: '6341', vespertina: '8633', nocturna: '1122' },
  { fecha: '2026-01-03', laPrevia: '5122', primera: '0692', matutina: '3453', vespertina: '2838', nocturna: '6266' },
  { fecha: '2026-01-02', laPrevia: '3791', primera: '3919', matutina: '3469', vespertina: '4467', nocturna: '8884' },
  { fecha: '2025-12-31', laPrevia: '0050', primera: '1645', matutina: null, vespertina: null, nocturna: '6965' },
  { fecha: '2025-12-30', laPrevia: '3953', primera: '7026', matutina: '2791', vespertina: '9932', nocturna: '2691' },
  { fecha: '2025-12-29', laPrevia: '1210', primera: '1099', matutina: '1416', vespertina: '6002', nocturna: '1701' },
  { fecha: '2025-12-27', laPrevia: '2081', primera: '9727', matutina: '8445', vespertina: '4352', nocturna: '0086' },
  { fecha: '2025-12-26', laPrevia: '0513', primera: '2488', matutina: '7904', vespertina: '2713', nocturna: '0300' },
  { fecha: '2025-12-23', laPrevia: '5867', primera: '0732', matutina: '8974', vespertina: '1735', nocturna: '9227' },
  { fecha: '2025-12-22', laPrevia: '8106', primera: '4447', matutina: '5546', vespertina: '4166', nocturna: '8641' },
  { fecha: '2025-12-20', laPrevia: '4366', primera: '2451', matutina: '6704', vespertina: '9665', nocturna: '0992' },
  { fecha: '2025-12-19', laPrevia: '8633', primera: '0375', matutina: '7854', vespertina: '9280', nocturna: '3967' },
  { fecha: '2025-12-18', laPrevia: '3679', primera: '2430', matutina: '2257', vespertina: '3806', nocturna: '4938' },
  { fecha: '2025-12-17', laPrevia: '7535', primera: '9027', matutina: '5566', vespertina: '5526', nocturna: '7056' },
  { fecha: '2025-12-16', laPrevia: '4440', primera: '5743', matutina: '8367', vespertina: '9176', nocturna: '1861' },
  { fecha: '2025-12-15', laPrevia: '3796', primera: '0577', matutina: '9950', vespertina: '3568', nocturna: '9139' },
  { fecha: '2025-12-13', laPrevia: '3675', primera: '1873', matutina: '4405', vespertina: '4702', nocturna: '7811' },
  { fecha: '2025-12-12', laPrevia: '2801', primera: '6989', matutina: '8438', vespertina: '5817', nocturna: '1806' },
  { fecha: '2025-12-11', laPrevia: '2253', primera: '8794', matutina: '4121', vespertina: '8233', nocturna: '2164' },
];

const sorteoMap: Record<string, string> = {
  laPrevia: 'La Previa',
  primera: 'Primera',
  matutina: 'Matutina',
  vespertina: 'Vespertina',
  nocturna: 'Nocturna',
};

async function seedResults(data: any[], tipoQuiniela: string) {
  for (const row of data) {
    const fecha = new Date(row.fecha);
    fecha.setHours(12, 0, 0, 0); // Set to noon to avoid timezone issues
    
    for (const [key, sorteoName] of Object.entries(sorteoMap)) {
      const premio = row[key];
      if (premio) {
        try {
          await prisma.resultadoHistorico.upsert({
            where: {
              fecha_sorteo_tipoQuiniela: {
                fecha,
                sorteo: sorteoName,
                tipoQuiniela,
              },
            },
            update: { primerPremio: premio },
            create: {
              fecha,
              sorteo: sorteoName,
              tipoQuiniela,
              primerPremio: premio,
            },
          });
          console.log(`✓ ${tipoQuiniela} - ${row.fecha} - ${sorteoName}: ${premio}`);
        } catch (error) {
          console.error(`Error seeding ${tipoQuiniela} ${row.fecha} ${sorteoName}:`, error);
        }
      }
    }
  }
}

async function main() {
  console.log('\n🏛️ Iniciando seed de datos históricos...\n');
  
  console.log('\n🟢 Seeding Provincial data...');
  await seedResults(provincialData, 'Provincial');
  
  console.log('\n🟡 Seeding Nacional data...');
  await seedResults(nacionalData, 'Nacional');
  
  const count = await prisma.resultadoHistorico.count();
  console.log(`\n✅ Seed completado. Total de registros: ${count}`);
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
