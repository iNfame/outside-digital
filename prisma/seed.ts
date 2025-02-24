import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
	const csvFilePath = path.join(__dirname, '../data/dataset.csv');
	const fileContent = fs.readFileSync(csvFilePath, 'utf-8');

	const rows = fileContent.trim().split('\n').slice(1); // Убираем заголовки
	const events = rows.map((row) => {
		const [id, timestamp, vehicleId, type] = row.split(',');

		return {
			id: parseInt(id, 10),
			timestamp: new Date(timestamp),
			vehicleId,
			type,
		};
	});

	console.log(`Seeding ${events.length} records...`);

	await prisma.event.createMany({
		data: events,
		skipDuplicates: true,
	});

	console.log('Seeding completed.');
}

main()
	.catch((error) => {
		console.error(error);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
