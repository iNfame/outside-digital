import { PrismaClient } from '@prisma/client';
import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

const prisma = new PrismaClient({
	log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : [], // logs
});

declare module 'fastify' {
	interface FastifyInstance {
		prisma: PrismaClient;
	}
}

export default fp(async (fastify: FastifyInstance) => {
	// Attach Prisma Client to Fastify instance
	fastify.decorate('prisma', prisma);

	// Disconnect Prisma on server shutdown
	fastify.addHook('onClose', async () => {
		await prisma.$disconnect();
	});
});
