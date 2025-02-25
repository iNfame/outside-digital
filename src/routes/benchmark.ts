import { FastifyInstance } from 'fastify';
import { performance } from 'perf_hooks';

export default async function benchmarkRoutes(fastify: FastifyInstance) {
	fastify.get('/benchmark', async (req, res) => {
		const results = [];

		// let's do a quick "SELECT 1" to check DB connection
		{
			const start = performance.now();
			// raw query example
			await fastify.prisma.$queryRawUnsafe('SELECT 1');
			const end = performance.now();

			results.push({
				query: 'SELECT 1',
				desc: 'Basic DB check, just a ping, nothing fancy',
				timeMs: Math.round(end - start)
			});
		}

		// next test => fetch everything from our 'event' table
		{
			const start = performance.now();
			// you can do $queryRaw or findMany; do whatever
			await fastify.prisma.$queryRawUnsafe('SELECT * FROM event');
			const end = performance.now();

			results.push({
				query: 'SELECT * FROM event',
				desc: 'Gets all rows in event table (be sure it’s not huge...)',
				timeMs: Math.round(end - start)
			});
		}

		// final => run an intervals-like query or something big
		{
			const start = performance.now();

			// This is just a sample, adjust for your own intervals logic
			await fastify.prisma.event.findMany({
				where: {
					timestamp: { gte: new Date('2023-01-01'), lte: new Date('2024-01-01') }
				},
				orderBy: { timestamp: 'asc' }
			});

			const end = performance.now();

			results.push({
				query: 'intervals-like query, or your main logic here',
				desc: 'Simulates the heavy intervals endpoint or similar big query',
				timeMs: Math.round(end - start)
			});
		}

		// return results as JSON array
		return res.send(results);
	});
}
