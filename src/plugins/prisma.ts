import { PrismaClient } from '@prisma/client';
import { FastifyInstance} from 'fastify';
import fp from 'fastify-plugin';

const prisma = new PrismaClient();

declare module 'fastify' {
	interface FastifyInstance {
		prisma: PrismaClient;
	}
}

export default fp(async (fastify) => {
	fastify.decorate('prisma', prisma);

	fastify.addHook('onClose', async () => {
		await prisma.$disconnect();
	});
});
