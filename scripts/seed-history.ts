import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const provinciaData = [
    { date: '2026-01-19', draws: ['8224', '9580', '4459', '6465'] },
    { date: '2026-01-17', draws: ['4179', '2353', '6701', '8647', '7055'] },
    { date: '2026-01-16', draws: ['4455', '3348', '8639', '6590', '45886'] },
    { date: '2026-01-15', draws: ['0658', '5273', '3092', '8267', '7907'] },
    { date: '2026-01-14', draws: ['4295', '2852', '2726', '1704', '0211'] },
    { date: '2026-01-13', draws: ['2593', '9730', '5600', '7326', '7600'] },
    { date: '2026-01-12', draws: ['8338', '3594', '8766', '2876', '1323'] },
    { date: '2026-01-10', draws: ['6511', '5802', '7768', '9213', '2546'] },
    { date: '2026-01-09', draws: ['0643', '2273', '3488', '3024', '4113'] },
    { date: '2026-01-08', draws: ['4699', '2777', '4805', '3738', '8694'] },
    { date: '2026-01-07', draws: ['2757', '0690', '6767', '3505', '4578'] },
    { date: '2026-01-06', draws: ['2565', '8548', '8567', '1236', '9900'] },
    { date: '2026-01-05', draws: ['3501', '5140', '5765', '0005', '4417'] },
    { date: '2026-01-03', draws: ['1533', '8212', '0037', '1466', '0505'] },
    { date: '2026-01-02', draws: ['1971', '1223', '6449', '3206', '6321'] },
    { date: '2025-12-31', draws: ['5080', '6529', '6664'] },
    { date: '2025-12-30', draws: ['5538', '6522', '4102', '2566', '3276'] },
    { date: '2025-12-29', draws: ['7327', '7486', '1454', '9157', '9561'] },
    { date: '2025-12-27', draws: ['7653', '1821', '4150', '4495', '0011'] },
    { date: '2025-12-26', draws: ['7094', '8476', '2262', '8928', '77222'] },
    { date: '2025-12-23', draws: ['7173', '3903', '9325', '0741', '4366'] },
    { date: '2025-12-22', draws: ['0751', '0489', '9927', '1733', '3145'] },
    { date: '2025-12-20', draws: ['8959', '0933', '4017', '2118', '6700'] },
    { date: '2025-12-19', draws: ['3252', '4149', '5345', '4687', '5224'] },
    { date: '2025-12-18', draws: ['5355', '0241', '5998', '6691', '3732'] },
    { date: '2025-12-17', draws: ['0910', '4911', '8506', '0420', '2859'] },
    { date: '2025-12-16', draws: ['0358', '0896', '1330', '8011', '5283'] },
    { date: '2025-12-15', draws: ['3113', '1921', '7700', '4442', '9454'] },
    { date: '2025-12-13', draws: ['1420', '3876', '6290', '0031', '1177'] },
    { date: '2025-12-12', draws: ['4655', '5599', '0474', '1112', '7928'] },
    { date: '2025-12-11', draws: ['4137', '7397', '6144', '2685', '5093'] }
];

const nacionalData = [
    { date: '2026-01-19', draws: ['9385', '9348', '1115', '2656'] },
    { date: '2026-01-17', draws: ['2422', '2789', '1710', '6433', '35797'] },
    { date: '2026-01-16', draws: ['0178', '9590', '8861', '1797', '0331'] },
    { date: '2026-01-15', draws: ['4996', '1373', '8726', '2340', '5465'] },
    { date: '2026-01-14', draws: ['2497', '8083', '3953', '2158', '9504'] },
    { date: '2026-01-13', draws: ['8465', '5465', '4922', '5537', '0341'] },
    { date: '2026-01-12', draws: ['5910', '7074', '8203', '9014', '2468'] },
    { date: '2026-01-10', draws: ['1803', '6393', '4724', '8603', '0352'] },
    { date: '2026-01-09', draws: ['7753', '4614', '3850', '3065', '3824'] },
    { date: '2026-01-08', draws: ['3343', '2696', '3655', '1835', '7259'] },
    { date: '2026-01-07', draws: ['4493', '8377', '6012', '3493', '7739'] },
    { date: '2026-01-06', draws: ['0077', '1439', '3782', '0891', '6303'] },
    { date: '2026-01-05', draws: ['9042', '0925', '6341', '8633', '1122'] },
    { date: '2026-01-03', draws: ['5122', '0692', '3453', '2838', '6266'] },
    { date: '2026-01-02', draws: ['3791', '3919', '3469', '4467', '8884'] },
    { date: '2025-12-31', draws: ['0050', '1645', '6965'] },
    { date: '2025-12-30', draws: ['3953', '7026', '2791', '9932', '2691'] },
    { date: '2025-12-29', draws: ['1210', '1099', '1416', '6002', '1701'] },
    { date: '2025-12-27', draws: ['2081', '9727', '8445', '4352', '30086'] },
    { date: '2025-12-26', draws: ['0513', '2488', '7904', '2713', '0300'] },
    { date: '2025-12-23', draws: ['5867', '0732', '8974', '1735', '9227'] },
    { date: '2025-12-22', draws: ['8106', '4447', '5546', '4166', '8641'] },
    { date: '2025-12-20', draws: ['4366', '2451', '6704', '9665', '0992'] },
    { date: '2025-12-19', draws: ['8633', '0375', '7854', '9280', '3967'] },
    { date: '2025-12-18', draws: ['3679', '2430', '2257', '3806', '4938'] },
    { date: '2025-12-17', draws: ['7535', '9027', '5566', '5526', '7056'] },
    { date: '2025-12-16', draws: ['4440', '5743', '8367', '9176', '1861'] },
    { date: '2025-12-15', draws: ['3796', '0577', '9950', '3568', '9139'] },
    { date: '2025-12-13', draws: ['3675', '1873', '4405', '4702', '7811'] },
    { date: '2025-12-12', draws: ['2801', '6989', '8438', '5817', '1806'] },
    { date: '2025-12-11', draws: ['2253', '8794', '4121', '8233', '2164'] }
];

const drawTypes = ['La Previa', 'Primera', 'Matutina', 'Vespertina', 'Nocturna'];

async function main() {
    console.log('Seeding historical data...');

    // Process Provincia
    for (const day of provinciaData) {
        for (let i = 0; i < day.draws.length; i++) {
            const num = day.draws[i]!;
            const date = new Date(day.date);
            const sorteo = drawTypes[i]!;

            const existing = await prisma.resultadoHistorico.findFirst({
                where: {
                    fecha: date,
                    sorteo: sorteo,
                    tipoQuiniela: 'Provincial'
                }
            });

            if (!existing) {
                await prisma.resultadoHistorico.create({
                    data: {
                        fecha: date,
                        sorteo: sorteo,
                        tipoQuiniela: 'Provincial',
                        primerPremio: num,
                        ultimoDos: num.slice(-2).slice(0, 2)
                    }
                });
            }
        }
    }

    // Process Nacional
    for (const day of nacionalData) {
        for (let i = 0; i < day.draws.length; i++) {
            const num = day.draws[i]!;
            const date = new Date(day.date);
            const sorteo = drawTypes[i]!;

            const existing = await prisma.resultadoHistorico.findFirst({
                where: {
                    fecha: date,
                    sorteo: sorteo,
                    tipoQuiniela: 'Nacional'
                }
            });

            if (!existing) {
                await prisma.resultadoHistorico.create({
                    data: {
                        fecha: date,
                        sorteo: sorteo,
                        tipoQuiniela: 'Nacional',
                        primerPremio: num,
                        ultimoDos: num.slice(-2).slice(0, 2)
                    }
                });
            }
        }
    }

    console.log('Seed completed successfully.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
