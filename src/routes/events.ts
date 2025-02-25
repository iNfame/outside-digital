import { FastifyInstance } from 'fastify';
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

		// Get last event before startDate
		const lastEventBefore = await fastify.prisma.event.findFirst({
			where: {
				vehicleId: parsed.data.vehicleId,
				timestamp: { lt: startDate },
			},
			orderBy: [{timestamp: 'desc'}, { id: 'desc' }]
		});

		// Get events in [startDate, endDate]
		const events = await fastify.prisma.event.findMany({
			where: {
				vehicleId: parsed.data.vehicleId,
				timestamp: {
					gte: startDate,
					lte: endDate
				},
			},
			orderBy: { timestamp: 'asc' }
		});

		// Merge result
		const result: EventRecord[] = [];

		// We start with the type from lastEventBefore or 'no_data'
		let prevType: EventType | 'no_data' = lastEventBefore
			? (lastEventBefore.type as EventType)
			: 'no_data';
		let prevTime = startDate.toISOString();

		// If no events at all
		if (events.length === 0) {
			result.push({
				from: prevTime,
				to: endDate.toISOString(),
				event: prevType
			});
			return res.send(result);
		}

		// Compare the first real event's type with prevType
		const firstEvent = events[0];
		const firstIso = firstEvent.timestamp.toISOString();
		if (firstEvent.type === prevType) {
			// If same type, we merge
			result.push({
				from: prevTime,
				to: firstIso,
				event: prevType
			});
		} else {
			// If different, we close the previous type
			if (prevTime !== firstIso) {
				result.push({
					from: prevTime,
					to: firstIso,
					event: prevType
				});
			}
			prevType = firstEvent.type as EventType;
		}

		prevTime = firstIso;

		// Iterate over the rest of events
		for (let i = 1; i < events.length; i++) {
			const e = events[i];
			const currentIso = e.timestamp.toISOString();

			// If the same type, same fix
			if (prevType === e.type) {
				if (result.length > 0 && result[result.length - 1].to !== currentIso) {
					result[result.length - 1].to = currentIso;
				}
			} else {
				// Another type -- close previous interval
				if (prevTime !== currentIso) {
					result.push({
						from: prevTime,
						to: currentIso,
						event: prevType
					});
				} else {
					// same timestamp, different type => ephemeral
					// we will still push a zero-length interval
					result.push({
						from: currentIso,
						to: currentIso,
						event: prevType
					});
				}
				prevType = e.type as EventType;
			}
			prevTime = currentIso;
		}

		// Last interval push
		if (prevTime !== endDate.toISOString()) {
			result.push({
				from: prevTime,
				to: endDate.toISOString(),
				event: prevType
			});
		}

		return res.send(result);
	});
}
