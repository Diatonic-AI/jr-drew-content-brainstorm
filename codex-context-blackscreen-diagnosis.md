# Codex Agent Context: Black Screen Diagnosis & Quiz Funnel Implementation

## PROBLEM STATEMENT
The Next.js web application (`apps/web-next`) is showing a **black screen** on the dashboard and other pages despite the dev server running. We need to:
1. Diagnose why pages are rendering black
2. Implement a comprehensive animated quiz funnel landing page
3. Set up Firebase authentication with protected routes

## CURRENT STATE ANALYSIS

### File Structure
- **Main App**: `/home/daclab-ai/Documents/JR-Drew-Content-Brainstorm/apps/web-next/`
- **Root Layout**: `app/layout.tsx` (uses ThemeProvider)
- **Home Page**: `app/page.tsx` (simple landing with dashboard link)
- **Dashboard**: `app/dashboard/page.tsx` (uses Sidebar, StatCard, DailyTimeline, ProductivityChart)

### Potential Black Screen Causes
1. **CSS/Tailwind Issue**: globals.css defines dark mode variables, but body might be defaulting to dark theme with black background
2. **Missing Dependencies**: `@shared/components/*` imports may not be resolving correctly
3. **Theme Provider Issue**: ThemeProvider might be setting dark mode by default
4. **Component Import Failures**: Dynamic imports or missing UI components could fail silently
5. **Build/Runtime Errors**: Check browser console and terminal for errors

### Immediate Diagnostic Steps
```bash
# 1. Check if server is actually serving content
curl http://localhost:3000 -I

# 2. Check browser console for errors (user should do this)
# 3. Verify shared components are accessible
ls -la shared/components/

# 4. Check if Tailwind is compiling correctly
cat apps/web-next/.next/static/css/*.css | grep "background"
```

## REQUIRED IMPLEMENTATION: ANIMATED QUIZ FUNNEL

### Architecture Overview
```
Landing Page (/)
  └─> Animated Quiz (3-page funnel, max 7 questions, 60 seconds)
       ├─> Typewriter text animation
       ├─> Narrator audio flow (optional)
       ├─> Input locking until answer provided
       ├─> Exit intent detection modal
       │    ├─> "Finish later" option
       │    └─> "Skip to Diatonic AI" button
       └─> Quiz completion
            └─> Alternative Home Page (single-page app info)
                 ├─> Contact Us (modal)
                 ├─> Create Account (modal with quiz answers submission)
                 └─> Login (modal with Google Auth0)
```

### Component Requirements

#### 1. Quiz Funnel Component (`components/quiz/QuizFunnel.tsx`)
- **Typewriter Animation**: Text appears character-by-character
- **Narrator Flow**: Questions appear with timing delays
- **Input Locking**: Page locks until user provides answer
- **7 Strategic Questions** (examples):
  1. "How do you currently track your daily productivity?"
  2. "What's your biggest challenge in managing projects?"
  3. "Do you work solo or with a team?"
  4. "How many projects do you juggle simultaneously?"
  5. "What's your ideal productivity tool feature?"
  6. "How do you measure success in your work?"
  7. "What time of day are you most productive?"

#### 2. Exit Intent Detection (`components/modals/ExitIntentModal.tsx`)
- Detect mouse movement towards browser close/back button
- Show modal: "Want to finish your quiz later?"
- Buttons:
  - "Take me to Diatonic AI" → Skip to alternative home
  - "Continue Quiz" → Close modal, resume

#### 3. Alternative Home Page (`app/home/page.tsx`)
- Clean, single-page design explaining Diatonic AI
- Showcase all features in scrollable sections
- CTAs: Contact Us, Create Account, Login

#### 4. Authentication Modals

##### Login Modal (`components/auth/LoginModal.tsx`)
- Email input (with syntax validation)
- Password input
- "Forgot Password" button
- Google Auth0 sign-in button
- Validation: Email format check

##### Signup Modal (`components/auth/SignupModal.tsx`)
- First Name
- Last Name
- Email (validated)
- Phone Number:
  - Country code dropdown (international area codes)
  - Real-time formatting: `(XXX)-XXX-XXXX`
  - Auto-lint as user types
- Address:
  - Autocomplete using Google Places API or similar
- Two checkboxes:
  1. ☑ "I agree to receive marketing and resources"
  2. ☑ "I accept user agreements, terms, and policies" (required)
- Submit button: "Submit My Answers" (when from quiz) or "Create Account"

##### Contact Modal (`components/modals/ContactModal.tsx`)
- Same fields as signup
- Additional: Message input box (textarea)
- "Book a Meeting" scheduler integration
- Shows assigned team member profile
- Meeting confirmation with:
  - Date/Time
  - Team member profile
  - Additional details input
  - Calendar invite acceptance encouragement

### Firebase Integration Requirements

#### Authentication Setup
```typescript
// lib/firebase/config.ts
import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

export const firebaseConfig = {
  // Configuration from Firebase console
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
```

#### Protected Routes (`middleware.ts`)
```typescript
// Protect routes requiring authentication
export const protectedRoutes = ['/dashboard', '/projects', '/settings']
export const publicRoutes = ['/', '/home', '/login', '/signup']
```

#### Auth Context Provider (`contexts/AuthContext.tsx`)
```typescript
// Manage authentication state globally
// Handle login, logout, signup, Google Auth
// Provide user data to components
```

### UX/UI Patterns to Follow
- **Consistent Design System**: Use existing shadcn/ui components
- **Smooth Animations**: Framer Motion for transitions
- **Responsive**: Mobile-first design
- **Accessible**: ARIA labels, keyboard navigation
- **Performance**: Lazy load modals, optimize animations

### Technical Stack
- **Frontend**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui
- **Animations**: Framer Motion
- **Auth**: Firebase Authentication + Google Auth0
- **Forms**: React Hook Form + Zod validation
- **Address Autocomplete**: Google Places API or Mapbox
- **Phone Input**: libphonenumber-js for formatting

## EXECUTION PLAN

### Phase 1: Diagnose Black Screen (IMMEDIATE)
1. Check browser DevTools console for errors
2. Verify ThemeProvider is not forcing dark mode
3. Check if `@shared/components` imports are resolving
4. Test if removing ThemeProvider fixes the issue
5. Verify Tailwind CSS is compiling background colors correctly

### Phase 2: Fix Black Screen
1. Update `layout.tsx` to force light theme initially
2. Add fallback background color to body
3. Fix any broken imports
4. Verify all UI components render correctly

### Phase 3: Implement Quiz Funnel (Priority Order)
1. Create typewriter animation component
2. Build quiz funnel logic with 7 questions
3. Implement input locking mechanism
4. Add exit intent detection
5. Create alternative home page

### Phase 4: Build Authentication System
1. Set up Firebase configuration
2. Create AuthContext provider
3. Build login modal with Google Auth0
4. Build signup modal with all fields
5. Implement phone number formatting
6. Add address autocomplete
7. Create contact modal with meeting scheduler

### Phase 5: Configure Routing
1. Set up middleware for protected routes
2. Create auth guards
3. Implement redirect logic
4. Test authentication flow end-to-end

### Phase 6: Polish & Test
1. Add smooth transitions between all states
2. Test on mobile devices
3. Verify quiz → signup → dashboard flow
4. Ensure all modals work correctly
5. Test exit intent detection accuracy

## SUCCESS CRITERIA
✅ Black screen is resolved, pages render correctly  
✅ Animated quiz funnel loads on landing page  
✅ Typewriter animation works smoothly  
✅ Exit intent detection triggers appropriately  
✅ All authentication modals function correctly  
✅ Phone number formats in real-time  
✅ Address autocomplete works  
✅ Firebase authentication is integrated  
✅ Protected routes redirect to login  
✅ Quiz answers can be submitted with account creation  
✅ Google Auth0 social sign-in works  
✅ Meeting scheduler assigns team members  
✅ Entire flow takes < 60 seconds for users in a hurry

## CODEX AGENT INSTRUCTIONS
Please systematically:
1. **Diagnose the black screen issue first** - check console, theme settings, CSS compilation
2. **Provide a fix** for the rendering issue
3. **Create the quiz funnel architecture** with all components
4. **Implement Firebase authentication** with all required modals
5. **Set up protected routes** and middleware
6. **Test the complete flow** and provide verification steps

Focus on clean, maintainable code that follows the existing patterns in the codebase. Use TypeScript strictly, implement proper error handling, and ensure accessibility standards are met.
