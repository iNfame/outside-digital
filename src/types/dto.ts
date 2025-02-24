import { z } from 'zod';
import { EventType } from './enums';

export const eventRequestSchema = z.object({
	startDate: z.string().datetime().refine((date) => !isNaN(Date.parse(date)), { message: 'Invalid startDate format' }),
	endDate: z.string().datetime().refine((date) => !isNaN(Date.parse(date)), { message: 'Invalid endDate format' }),
	vehicleId: z.string().min(1, { message: 'vehicleId is required' })
});

export type EventRequest = z.infer<typeof eventRequestSchema>;

export type EventRecord = {
	from: string;
	to: string;
	event: EventType | 'no_data';
};
