# Tracking System Overview

- **Window Monitor (`src/lib/tracking/window-monitor.ts`):** Periodically captures window metadata and emits `ActivityEvent` objects.
- **Classifier (`src/lib/tracking/activity-classifier.ts`):** Applies keyword heuristics to assign activity categories for timeline segmentation.
- **Metadata Extractor (`src/lib/tracking/metadata-extractor.ts`):** Pulls browser window context (title, URL, language) for event enrichment.
- **Store integration:** `trackingStore` persists configuration (auto-start, break reminders, privacy), session state, timeline blocks, and alerts.
- **Services:** `tracking.service.ts` provides fetch wrappers for server sync (day totals, configuration, events, timeline).
- **UI consumption:** Dashboard timeline, work hours panel, break timer, and workblocks table render tracking outputs.
