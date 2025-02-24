import { FastifyInstance } from 'fastify';
import prisma from '../plugins/prisma';
import { eventRequestSchema, EventRecord } from '../types/dto';
import { EventType } from '../types/enums';

export default async function eventsRoutes(fastify: FastifyInstance) {
	fastify.get('/events', async (req, res) => {
		// validation
		const parsed = eventRequestSchema.safeParse(req.query);
		if (!parsed.success) {
			return res.status(400).send({ error: 'Invalid input', details: parsed.error.format() });
		}

		const startDate = new Date(parsed.data.startDate);
		const endDate = new Date(parsed.data.endDate);

		if (startDate > endDate) {
			return res.status(400).send({ error: 'startDate cannot be greater than endDate' });
		}

		// Fetch events from DB
		const events = await fastify.prisma.event.findMany({
			where: {
				vehicleId: parsed.data.vehicleId,
				timestamp: {
					gte: startDate,
					lte: endDate,
				},
			},
			orderBy: { timestamp: 'asc' }
		});

		// console.log(events.map(e => ({
		// 	raw: e.timestamp,
		// 	iso: e.timestamp.toISOString(),
		// 	utc: new Date(e.timestamp).toISOString()
		// })));

		const result: EventRecord[] = [];

		let prevEvent: EventType | 'no_data' = 'no_data';
		let prevTimestamp = startDate.toISOString();

		if (events.length === 0) {
			result.push({ from: prevTimestamp, to: endDate.toISOString(), event: 'no_data' });
		} else {
			for (let i = 0; i < events.length; i++) {
				const event = events[i];
				const eventTimestamp = event.timestamp.toISOString();

				// If the same event type, just add to previous @todo: make clear w/ PM
				if (i > 0 && events[i - 1].type === event.type) {
					continue;
				}

				// If event type is different, close the previous event
				if (prevEvent !== 'no_data' && prevTimestamp !== eventTimestamp) {
					result.push({ from: prevTimestamp, to: eventTimestamp, event: prevEvent });
				}

				// Prev event refreshment
				prevEvent = event.type as EventType;
				prevTimestamp = eventTimestamp;
			}

			// Last interval
			if (prevTimestamp !== endDate.toISOString()) {
				result.push({ from: prevTimestamp, to: endDate.toISOString(), event: prevEvent });
			}
		}

		return res.send(result);
	});
}
