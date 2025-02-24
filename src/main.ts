import Fastify from 'fastify';
import prismaPlugin from './plugins/prisma';
import fastifyEnv from '@fastify/env';
import fastifyCors from '@fastify/cors';
import fastifySensible from '@fastify/sensible';

const fastify = Fastify({
	logger: true
});

const port = Number(process.env.PORT) || 3000;

// plugins - env
fastify.register(fastifyEnv, {
	schema: {
		type: 'object',
		required: ['DATABASE_URL'],
		properties: {
			DATABASE_URL: { type: 'string' }
		}
	},
	dotenv: true
});
// plugins - cors
fastify.register(fastifyCors);
// plugins - utils
fastify.register(fastifySensible);
// plugins - prisma
fastify.register(prismaPlugin);

fastify.get('/test', async (req, res) => {
	try {
		const events = await fastify.prisma.event.findMany();
		res.send(events);
	} catch (error) {
		fastify.log.error(error);
		res.internalServerError('db error');
	}
});

// server launch
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
