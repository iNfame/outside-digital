import Fastify from 'fastify';
import fastifyEnv from '@fastify/env';
import fastifyCors from '@fastify/cors';
import fastifySensible from '@fastify/sensible';
import eventsRoutes from './routes/events';
import prismaPlugin from './plugins/prisma';

const fastify = Fastify({ logger: true });

const port = Number(process.env.PORT) || 3000;

// plugins section
fastify.register(fastifyEnv, {			// env
	schema: {
		type: 'object',
		required: ['DATABASE_URL'],
		properties: {
			DATABASE_URL: { type: 'string' }
		}
	},
	dotenv: true
});
fastify.register(fastifyCors);			// cors
fastify.register(fastifySensible);	// utils
fastify.register(prismaPlugin);			// prisma
fastify.register(eventsRoutes);			// routes

// Запуск сервера
const bootstrap = async (port: number) => {
	try {
		await fastify.listen({ port, host: '0.0.0.0' });
		console.log('Server is running on http://localhost:3000');
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
};

bootstrap(port);
