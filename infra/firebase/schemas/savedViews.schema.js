"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SavedViewSchema = void 0;
const zod_1 = require("zod");
const SortSchema = zod_1.z.object({
    by: zod_1.z.string(),
    dir: zod_1.z.enum(['asc', 'desc']),
});
exports.SavedViewSchema = zod_1.z.object({
    id: zod_1.z.string(),
    ownerId: zod_1.z.string(),
    scope: zod_1.z.enum(['user', 'org']),
    orgId: zod_1.z.string().optional(),
    route: zod_1.z.string(),
    name: zod_1.z.string().min(1).max(100),
    filters: zod_1.z.record(zod_1.z.unknown()).optional(),
    sorts: zod_1.z.array(SortSchema).default([]),
    columns: zod_1.z.array(zod_1.z.string()).optional(),
    grouping: zod_1.z.string().optional(),
    range: zod_1.z
        .object({
        from: zod_1.z.number(),
        to: zod_1.z.number(),
    })
        .optional(),
    createdAt: zod_1.z.string().datetime(),
    updatedAt: zod_1.z.string().datetime().optional(),
});
//# sourceMappingURL=savedViews.schema.js.map