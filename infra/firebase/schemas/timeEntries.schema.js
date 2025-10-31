"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTimeEntrySchema = exports.CreateTimeEntrySchema = exports.TimeEntrySchema = void 0;
const zod_1 = require("zod");
exports.TimeEntrySchema = zod_1.z.object({
    id: zod_1.z.string(),
    userId: zod_1.z.string(),
    projectId: zod_1.z.string().optional(),
    taskId: zod_1.z.string().optional(),
    start: zod_1.z.string().datetime(),
    end: zod_1.z.string().datetime().nullable().optional(),
    duration: zod_1.z.number().int().nonnegative().nullable().optional(),
    notes: zod_1.z.string().max(1000).optional(),
    tags: zod_1.z.array(zod_1.z.string()).default([]),
    billable: zod_1.z.boolean().default(false),
    createdAt: zod_1.z.string().datetime(),
    updatedAt: zod_1.z.string().datetime().optional(),
});
exports.CreateTimeEntrySchema = exports.TimeEntrySchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    duration: true,
}).extend({
    start: zod_1.z.string().datetime().optional(),
    end: zod_1.z.string().datetime().optional(),
});
exports.UpdateTimeEntrySchema = exports.TimeEntrySchema.partial().omit({
    id: true,
    userId: true,
    createdAt: true,
});
//# sourceMappingURL=timeEntries.schema.js.map