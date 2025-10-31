# Comprehensive Code Fix Instructions

You are a senior full-stack engineer tasked with fixing critical issues in a React/TypeScript frontend and Firebase backend codebase.

**CONTEXT FROM CODE REVIEW**:
The frontend code review identified 10 blocking issues, parsing errors, security vulnerabilities, and widespread WCAG accessibility violations. You must fix ALL issues systematically in the following priority order.

**PRIORITY ORDER**:
1. Fix 10 blocking issues (compilation errors, critical security)
2. Resolve parsing errors blocking CI
3. Fix Firebase backend security issues
4. Resolve widespread WCAG violations
5. Fix remaining warnings

---

## PHASE 1: FIX 10 BLOCKING ISSUES (HIGHEST PRIORITY)

### Issue 1: Missing Import (COMPILATION BLOCKER)
**File**: `apps/web/src/stores/trackingStore.ts`
**Line**: 24
**Action**: Add `TrackingDayTotals` to the existing import from `@/types/tracking`

**Fix**:
```typescript
import type {
  TrackingAlert,
  TrackingConfiguration,
  TrackingDiagnostics,
  TrackingSession,
  TrackingState,
  TrackingDayTotals,  // ADD THIS LINE
} from '@/types/tracking'
```

### Issue 2: Insecure Auth Token Storage (CRITICAL SECURITY)
**File**: `apps/web/src/services/auth.service.ts`
**Lines**: 15-22
**Action**: Replace cookie storage with sessionStorage

**Fix**: Replace the `persistToken` function:
```typescript
async function persistToken(user: User | null) {
  if (!user) {
    sessionStorage.removeItem('diatonicAuthToken')
    return
  }
  const token = await user.getIdToken()
  sessionStorage.setItem('diatonicAuthToken', token)
}
```

Also update any token retrieval functions to use `sessionStorage.getItem()`.

### Issue 3: PII Logging (COMPLIANCE VIOLATION)
**File**: `apps/web/src/components/auth/SignupModal.tsx`
**Lines**: 198-199
**Action**: Remove console.info statements that log PII

**Fix**: Delete or guard these lines:
```typescript
// DELETE THESE LINES:
console.info('Collected quiz answers', answers)
console.info('Marketing opt-in', values.marketingOptIn)
```

### Issue 4: Pre-checked Marketing Consent (GDPR/CCPA VIOLATION)
**File**: `apps/web/src/components/auth/SignupModal.tsx`
**Line**: 82
**Action**: Change default marketingOptIn to false

**Fix**:
```typescript
defaultValues: {
  // ... other fields
  marketingOptIn: false,  // CHANGE FROM true TO false
}
```

### Issue 5: Missing Form Label Association (WCAG A11Y)
**File**: `apps/web/src/components/auth/SignupModal.tsx`
**Lines**: 355-368 (Field component)
**Action**: Add htmlFor and id association

**Fix**: Update the Field component:
```typescript
interface FieldProps {
  label: string
  optional?: boolean
  error?: string
  children: React.ReactElement
}

function Field({ label, optional, error, children }: FieldProps) {
  const id = React.useId()
  
  return (
    <div>
      <label htmlFor={id}>
        <span>
          {label}
          {optional && <span className="text-xs font-normal text-muted-foreground">(optional)</span>}
        </span>
      </label>
      {React.cloneElement(children, { id })}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
```

### Issue 6: Mobile Nav Missing A11Y Attributes (WCAG)
**File**: `apps/web/src/components/navigation/MobileNav.tsx`
**Lines**: 17-23
**Action**: Add ARIA attributes to toggle button and nav element

**Fix**:
```typescript
<button
  type="button"
  className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border"
  onClick={() => setOpen((value) => !value)}
  aria-label="Toggle navigation menu"
  aria-expanded={open}
  aria-controls="mobile-nav-menu"
>
  <Menu />
</button>
{open && (
  <nav id="mobile-nav-menu" role="navigation">
    {/* ... existing menu items ... */}
  </nav>
)}
```

### Issue 7: Timeline Block Missing A11Y Labels (WCAG)
**File**: `apps/web/src/components/dashboard/TimelineBlock.tsx`
**Lines**: 40-57
**Action**: Add aria-label with descriptive text

**Fix**: Add these imports and aria-label:
```typescript
import { format, parseISO } from 'date-fns'

export const TimelineBlock = ({ block, left, width, onClick }: TimelineBlockProps) => {
  const startLabel = format(parseISO(block.startTime), 'h:mm a')
  const endLabel = format(parseISO(block.endTime), 'h:mm a')
  const scoreText = block.productivityScore ? `, productivity score ${block.productivityScore}` : ''
  
  return (
    <button
      type="button"
      aria-label={`${block.category} activity from ${startLabel} to ${endLabel}${scoreText}`}
      className={cn(
        'absolute top-0 h-full cursor-pointer rounded border border-white/20 transition-opacity hover:opacity-90',
        categoryColors[block.category]
      )}
      style={{ left: `${left}%`, width: `${width}%` }}
      onClick={() => onClick?.(block)}
    >
      {/* ... existing content ... */}
    </button>
  )
}
```

### Issue 8: Table Search Missing Label (WCAG)
**File**: `apps/web/src/components/ui/Table.tsx`
**Lines**: 159-164
**Action**: Add label for search input

**Fix**:
```typescript
{enableSearch && (
  <div className="mb-4">
    <label htmlFor="data-table-search" className="sr-only">
      Search table
    </label>
    <input
      id="data-table-search"
      type="text"
      placeholder={searchPlaceholder}
      value={globalFilter}
      onChange={(e) => setGlobalFilter(e.target.value)}
      className="..."
    />
  </div>
)}
```

### Issue 9: Table Sort Buttons Missing aria-sort (WCAG)
**File**: `apps/web/src/components/ui/Table.tsx`
**Lines**: 188-206
**Action**: Add aria-sort and aria-label to sort buttons

**Fix**:
```typescript
<button
  type="button"
  className={cn(
    'flex items-center gap-1 text-left font-semibold',
    header.column.getCanSort() ? 'cursor-pointer' : 'cursor-default'
  )}
  onClick={header.column.getToggleSortingHandler()}
  disabled={!header.column.getCanSort()}
  aria-label={`Sort by ${String(header.column.columnDef.header)}`}
  aria-sort={
    header.column.getIsSorted() === 'asc' ? 'ascending' :
    header.column.getIsSorted() === 'desc' ? 'descending' :
    'none'
  }
>
  {flexRender(header.column.columnDef.header, header.getContext())}
  {{
    asc: '↑',
    desc: '↓',
  }[header.column.getIsSorted() as string] ?? null}
</button>
```

### Issue 10: Clickable Table Rows Not Keyboard Accessible (WCAG)
**File**: `apps/web/src/components/ui/Table.tsx`
**Lines**: 214-234
**Action**: Add keyboard support to clickable rows

**Fix**:
```typescript
<TableRow
  key={row.id}
  data-state={row.getIsSelected() && 'selected'}
  role={onRowClick ? 'button' : undefined}
  tabIndex={onRowClick ? 0 : undefined}
  onClick={() => onRowClick?.(row.original)}
  onKeyDown={(event) => {
    if (onRowClick && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault()
      onRowClick(row.original)
    }
  }}
  className={cn(
    onRowClick && 'cursor-pointer hover:bg-muted/50'
  )}
>
  {/* ... existing cells ... */}
</TableRow>
```

---

## PHASE 2: FIX PARSING ERROR (CI BLOCKER)

**File**: `apps/web/src/components/quiz/QuizFunnel.tsx`
**Line**: 199
**Error**: Parsing error: ',' expected

**Action**: 
1. Read the file around line 199
2. Identify the syntax error (likely unclosed JSX tag, missing comma, or incorrect nesting)
3. Fix the syntax error

---

## PHASE 3: FIREBASE BACKEND SECURITY REVIEW

**Tasks**:
1. Review `infra/firebase/functions/` for:
   - Missing input validation
   - Unauthenticated function calls
   - Insufficient error handling

2. Check `infra/firebase/firestore.rules`:
   - Ensure deny-by-default
   - Validate all write operations
   - Check for data leakage in reads

3. Check `infra/firebase/storage.rules`:
   - Proper authentication checks
   - File type validation
   - Size limits

**If issues found, fix them following Firebase 11 best practices.**

---

## PHASE 4: ADDITIONAL WCAG VIOLATIONS

**Scan for and fix**:
- Missing alt text on images
- Missing focus indicators
- Form error announcements
- Skip links for navigation

**Focus areas**:
- `apps/web/src/components/dashboard/`
- `apps/web/src/components/navigation/`
- `apps/web/src/components/auth/`

---

## PHASE 5: REMAINING LINT WARNINGS

After all above fixes:
```bash
pnpm --filter @jrpm/web lint --fix
```

Fix remaining:
- Import order warnings
- Unused variable warnings (prefix with `_` if intentionally unused)
- Filename case warnings (low priority)

---

## EXECUTION PLAN

1. **Read** each file mentioned above
2. **Apply** fixes systematically (Phases 1-5 in order)
3. **Test** after each phase:
   - Run: `pnpm --filter @jrpm/web lint:strict`
   - Run: `pnpm typecheck`
4. **Report** progress after each phase
5. **Create summary** of all changes made

**START WITH PHASE 1, ISSUE 1 NOW.**
