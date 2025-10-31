"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivitySchema = void 0;
const zod_1 = require("zod");
exports.ActivitySchema = zod_1.z.object({
    id: zod_1.z.string(),
    userId: zod_1.z.string(),
    action: zod_1.z.string(),
    entityType: zod_1.z.string(),
    entityId: zod_1.z.string(),
    timestamp: zod_1.z.string().datetime(),
    context: zod_1.z.record(zod_1.z.unknown()).optional(),
    changes: zod_1.z
        .object({
        before: zod_1.z.record(zod_1.z.unknown()).optional(),
        after: zod_1.z.record(zod_1.z.unknown()).optional(),
    })
        .optional(),
});
//# sourceMappingURL=activity.schema.js.map