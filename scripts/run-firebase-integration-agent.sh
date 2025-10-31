#!/usr/bin/env bash
# Firebase Integration Agent - Codex CLI Execution Script
# Usage: ./scripts/run-firebase-integration-agent.sh [phase_number]

set -euo pipefail

REPO_ROOT="/home/daclab-ai/Documents/JR-Drew-Content-Brainstorm"
CONTEXT_FILE="$REPO_ROOT/docs/automation/agents/codex-firebase-integration-context.md"
WARP_FILE="$REPO_ROOT/WARP.md"

# Color output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}╔═══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║    Firebase Backend Review & Frontend Integration Agent       ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Verify context file exists
if [ ! -f "$CONTEXT_FILE" ]; then
    echo -e "${YELLOW}⚠️  Context file not found: $CONTEXT_FILE${NC}"
    exit 1
fi

# Verify WARP.md exists
if [ ! -f "$WARP_FILE" ]; then
    echo -e "${YELLOW}⚠️  WARP.md not found: $WARP_FILE${NC}"
    exit 1
fi

echo -e "${BLUE}📂 Repository: $REPO_ROOT${NC}"
echo -e "${BLUE}📄 Context File: $CONTEXT_FILE${NC}"
echo -e "${BLUE}📋 WARP Reference: $WARP_FILE${NC}"
echo ""

# Phase selection
PHASE=${1:-""}
if [ -z "$PHASE" ]; then
    echo "Select a phase to execute:"
    echo ""
    echo "  1 - Backend Infrastructure Discovery and Audit"
    echo "  2 - Frontend Requirements Analysis"
    echo "  3 - Firebase Documentation Research"
    echo "  4 - Firestore Schema Design"
    echo "  5 - Cloud Functions Implementation"
    echo "  6 - Frontend Firebase Integration"
    echo "  7 - Authentication Flow Implementation"
    echo "  8 - Real-time Features Implementation"
    echo "  9 - Testing and Validation"
    echo " 10 - Documentation and Deployment"
    echo ""
    echo "  all - Execute all phases sequentially"
    echo "  custom - Provide custom prompt"
    echo ""
    read -p "Enter phase number (1-10, all, or custom): " PHASE
fi

# Generate prompts based on phase
case $PHASE in
    1)
        PROMPT="Execute Phase 1: Backend Infrastructure Discovery and Audit

**Context**: Read the full context from $CONTEXT_FILE

**Tasks**:
1. Explore and catalog both /backend/firebase/ and /infra/firebase/ directories
2. Identify duplicate, legacy, or deprecated code patterns
3. Document current Firebase SDK versions (target: Firebase 11)
4. Verify Firebase CLI installation and available projects
5. Test Firebase emulator suite functionality
6. Review existing Cloud Functions in infra/firebase/functions/src/
7. Audit firestore.rules and storage.rules for completeness

**Output**: Create detailed markdown report in docs/backend/infrastructure-audit-report.md"
        ;;
    2)
        PROMPT="Execute Phase 2: Frontend Requirements Analysis

**Context**: Read the full context from $CONTEXT_FILE

**Tasks**:
1. Analyze apps/web/src/ structure completely
2. Map all Zustand stores (src/stores/) to required Firebase collections
3. Document all TypeScript schemas (src/schemas/) and their Firebase mapping
4. List all React hooks (src/hooks/) requiring Firebase integration
5. Review all service files (src/services/) and document mock API endpoints
6. Identify real-time data requirements (notifications, activity tracking)
7. Extract authentication requirements from src/components/auth/

**Output**: Create requirements document in docs/backend/frontend-firebase-requirements.md"
        ;;
    3)
        PROMPT="Execute Phase 3: Firebase Documentation Research

**Context**: Read the full context from $CONTEXT_FILE

**Tasks**:
1. Research Firebase 11 official documentation for:
   - Firestore data modeling best practices
   - Multi-tenant SaaS security rules patterns
   - Cloud Functions v2 API patterns
   - Authentication flows (email/password, OAuth)
2. Search for Firebase + React 18 integration patterns
3. Research TanStack Query with Firebase real-time listeners
4. Find Zustand + Firebase state synchronization strategies
5. Document offline-first patterns with Firebase persistence
6. Study Firestore indexing strategies for query optimization
7. Research Cloud Functions cold start optimization

**Output**: Create research summary in docs/backend/firebase-research-findings.md"
        ;;
    4)
        PROMPT="Execute Phase 4: Firestore Schema Design

**Context**: Read the full context from $CONTEXT_FILE

**Tasks**:
1. Design complete Firestore collection architecture
2. Map frontend TypeScript schemas to Firestore document structures
3. Define field types, validation rules, and default values
4. Document relationships between collections
5. Specify required composite indexes for complex queries
6. Write comprehensive security rules for multi-tenant access
7. Implement role-based access control (owner/admin/member)
8. Ensure tenant isolation for all queries

**Output**: 
- Update infra/firebase/firestore.rules
- Update infra/firebase/firestore.indexes.json
- Create docs/backend/modeling/firestore-schema-design.md"
        ;;
    5)
        PROMPT="Execute Phase 5: Cloud Functions Implementation

**Context**: Read the full context from $CONTEXT_FILE

**Tasks**:
1. Analyze required Cloud Functions from frontend needs
2. Implement auth triggers (onCreate, onDelete) in infra/firebase/functions/src/
3. Create Firestore triggers for document lifecycle management
4. Build HTTP callable functions for complex business logic
5. Add scheduled functions (analytics, cleanup, reports)
6. Implement input validation using Zod schemas
7. Add structured logging and comprehensive error handling
8. Configure appropriate memory limits and timeouts
9. Test all functions via Firebase emulators

**Output**: 
- Complete infra/firebase/functions/src/ implementation
- Create docs/backend/cloud-functions-reference.md"
        ;;
    6)
        PROMPT="Execute Phase 6: Frontend Firebase Integration

**Context**: Read the full context from $CONTEXT_FILE

**Tasks**:
1. Replace mock services with real Firebase implementations:
   - Update apps/web/src/services/auth.service.ts
   - Implement apps/web/src/services/projects.service.ts
   - Implement apps/web/src/services/tasks.service.ts
2. Update React hooks to use Firebase:
   - Modify useProjects for Firestore queries
   - Modify useTasks with onSnapshot real-time listeners
   - Update useAuth with Firebase Auth state
3. Integrate TanStack Query with Firebase operations
4. Implement optimistic updates and error handling
5. Configure offline persistence properly
6. Add retry logic for transient failures

**Output**: Complete service layer integration with tests"
        ;;
    7)
        PROMPT="Execute Phase 7: Authentication Flow Implementation

**Context**: Read the full context from $CONTEXT_FILE

**Tasks**:
1. Wire login/signup modals to Firebase Auth
2. Implement email/password authentication flow
3. Add Google OAuth provider integration
4. Create password reset functionality
5. Implement email verification process
6. Set up protected route guards (apps/web/src/routes/)
7. Add role-based access control middleware
8. Implement auth state persistence across sessions
9. Create user profile in Firestore on signup

**Output**: Complete authentication system with tests"
        ;;
    8)
        PROMPT="Execute Phase 8: Real-time Features Implementation

**Context**: Read the full context from $CONTEXT_FILE

**Tasks**:
1. Implement real-time activity event streaming
2. Create real-time notifications system with FCM
3. Add presence indicators for team members
4. Set up offline queue for activity synchronization
5. Implement collaborative task editing with conflict resolution
6. Add live project status updates across users
7. Create real-time dashboard data updates
8. Implement notification preferences management

**Output**: Complete real-time features with offline support"
        ;;
    9)
        PROMPT="Execute Phase 9: Testing and Validation

**Context**: Read the full context from $CONTEXT_FILE

**Tasks**:
1. Comprehensive testing with Firebase emulators
2. Test all CRUD operations for each collection
3. Validate security rules with different user roles
4. Test offline/online data synchronization
5. End-to-end user flows (signup → project → task)
6. Performance testing with large datasets
7. Security penetration testing
8. Cross-browser and mobile testing

**Output**: 
- Test reports in reports/firebase-testing/
- Update WARP.md with test procedures"
        ;;
    10)
        PROMPT="Execute Phase 10: Documentation and Deployment

**Context**: Read the full context from $CONTEXT_FILE

**Tasks**:
1. Create comprehensive Firebase setup guide
2. Document all collections, schemas, and relationships
3. Write Cloud Functions API reference documentation
4. Create deployment runbooks for staging and production
5. Set up CI/CD pipelines for Firebase Functions
6. Configure production environment variables and secrets
7. Remove mock API infrastructure completely
8. Archive deprecated backend code
9. Update WARP.md with Firebase integration guidelines
10. Create migration guide for existing data

**Output**: 
- Complete documentation in docs/
- Production-ready deployment configuration"
        ;;
    all)
        echo -e "${YELLOW}⚠️  Sequential execution of all phases - this will take significant time${NC}"
        read -p "Are you sure? (yes/no): " CONFIRM
        if [ "$CONFIRM" != "yes" ]; then
            echo "Aborted."
            exit 0
        fi
        PROMPT="Execute all 10 phases of Firebase Backend Review and Frontend Integration sequentially.

Read full context from $CONTEXT_FILE and follow WARP.md guidelines.

Execute phases in order:
1. Backend Infrastructure Audit
2. Frontend Requirements Analysis
3. Firebase Documentation Research
4. Firestore Schema Design
5. Cloud Functions Implementation
6. Frontend Firebase Integration
7. Authentication Flow Implementation
8. Real-time Features Implementation
9. Testing and Validation
10. Documentation and Deployment

Create progress reports after each phase completion."
        ;;
    custom)
        echo -e "${BLUE}Enter your custom prompt (press Ctrl+D when done):${NC}"
        PROMPT=$(cat)
        ;;
    *)
        echo -e "${YELLOW}Invalid phase selection: $PHASE${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}🚀 Launching Codex CLI Agent...${NC}"
echo ""

# Execute Codex CLI
# Adjust command based on your Codex CLI installation
# Note: codex CLI doesn't support --context-file, so we include file paths in the prompt
codex exec --cd "$REPO_ROOT" \
  "Context Files:
- Main Context: $CONTEXT_FILE
- WARP Reference: $WARP_FILE

Please read both context files before starting.

$PROMPT"

echo ""
echo -e "${GREEN}✅ Agent execution complete!${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "  1. Review generated files and changes"
echo "  2. Run tests: pnpm test"
echo "  3. Check Firebase emulators: pnpm dev:emulators"
echo "  4. Lint code: pnpm lint:strict"
echo ""
