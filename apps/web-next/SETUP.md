# Diatonic AI - Quiz Funnel & Authentication Setup

## 🎉 What Was Implemented

The codex agent has successfully created:

### ✅ Animated Quiz Funnel System
- **Typewriter animation** for narrator questions
- **7 strategic productivity questions** with timed progression
- **Exit intent detection** to capture users trying to leave
- **Input locking** mechanism until answers are provided
- **60-second completion** flow for users in a hurry
- **Smooth transitions** using Framer Motion

### ✅ Authentication System
- **Firebase Authentication** integration
- **Google OAuth** sign-in
- **Login Modal** with email/password validation
- **Signup Modal** with:
  - Real-time phone number formatting
  - International country code selector
  - Address autocomplete (Google Places API)
  - Marketing & Terms agreement checkboxes
- **Contact Modal** with meeting scheduler

### ✅ Protected Routes
- Middleware configured to protect `/dashboard`, `/projects`, `/settings`
- Automatic redirect to login for unauthorized access
- Auth token management via cookies

### ✅ Alternative Home Page
- Clean landing page for users who skip the quiz
- Feature showcase sections
- Call-to-action buttons for signup/contact

## 🚀 Setup Instructions

### Step 1: Configure Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env.local
```

2. Fill in your Firebase credentials:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project (or create a new one)
   - Go to Project Settings > General
   - Scroll to "Your apps" > "SDK setup and configuration"
   - Copy the config values to `.env.local`

3. Enable Google Authentication:
   - In Firebase Console, go to Authentication > Sign-in method
   - Enable "Google" provider
   - Add your app's domain to authorized domains

4. Get Google Places API Key:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Enable "Places API"
   - Create credentials > API Key
   - Add the key to `.env.local` as `NEXT_PUBLIC_GOOGLE_PLACES_API_KEY`

### Step 2: Start the Development Server

```bash
pnpm dev
```

The app will be available at `http://localhost:3000`

### Step 3: Test the Black Screen Fix

The black screen issue was likely caused by:
1. Missing theme provider configuration
2. Dark mode CSS variables without fallback
3. Component import resolution issues

**Fixes applied:**
- Updated `layout.tsx` to properly wrap with `AuthProvider` and `ThemeProvider`
- Ensured CSS variables have proper fallbacks
- Fixed path aliases in `tsconfig.json` for component imports

**To verify the fix:**
1. Open `http://localhost:3000` in your browser
2. Check browser DevTools Console for any errors
3. The quiz funnel should load with animated text
4. Background should be white/light (not black)

### Step 4: Test the Quiz Funnel Flow

**Complete User Journey:**
1. **Landing Page** → Quiz intro appears with typewriter animation
2. **Quiz Questions** → 7 questions about productivity (60 seconds max)
3. **Exit Intent** → Try to leave → Modal appears with options
4. **Quiz Completion** → Submit answers → Signup modal appears
5. **Authentication** → Create account or login
6. **Dashboard** → Redirect to authenticated dashboard

**Test Exit Intent:**
- Move mouse quickly towards browser close button
- Exit intent modal should appear
- Choose "Take me to Diatonic AI" → Skip to alternative home page

**Test Authentication:**
- Click "Login" → Modal opens with email/password fields
- Click "Sign in with Google" → Google OAuth flow
- Create account → All form fields with validation
- Phone number → Auto-formats as you type
- Address → Autocomplete suggestions appear

### Step 5: Test Protected Routes

```bash
# Try accessing dashboard without auth (should redirect to home)
curl -I http://localhost:3000/dashboard

# Login via UI, then access dashboard (should work)
```

## 📁 Key Files Created

### Components
- `components/quiz/QuizFunnel.tsx` - Main quiz orchestrator
- `components/auth/LoginModal.tsx` - Login form with Google OAuth
- `components/auth/SignupModal.tsx` - Signup with phone/address validation
- `components/modals/ContactModal.tsx` - Contact form with scheduler
- `components/modals/ExitIntentModal.tsx` - Exit intent detection
- `components/ui/dialog.tsx` - Modal wrapper (shadcn/ui)
- `components/ui/checkbox.tsx` - Checkbox component
- `components/ui/textarea.tsx` - Textarea component

### Hooks
- `src/hooks/useTypewriter.ts` - Typewriter animation logic
- `src/hooks/useNarrator.ts` - Narrator question flow
- `src/hooks/useCountdown.ts` - 60-second timer
- `src/hooks/useExitIntent.ts` - Mouse movement detection

### Authentication
- `src/lib/firebase/config.ts` - Firebase initialization
- `src/contexts/AuthContext.tsx` - Global auth state
- `middleware.ts` - Route protection

### Pages
- `app/page.tsx` - Quiz funnel entry point (updated)
- `app/home/page.tsx` - Alternative landing page
- `app/layout.tsx` - Root layout with providers (updated)

## 🐛 Troubleshooting

### Black Screen Still Appears
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
pnpm install

# Restart dev server
pnpm dev
```

### Firebase Errors
- Check `.env.local` has all required variables
- Verify Firebase project is active in console
- Ensure Google authentication is enabled
- Check browser console for specific error messages

### Google Places Not Working
- Verify `NEXT_PUBLIC_GOOGLE_PLACES_API_KEY` is set
- Enable Places API in Google Cloud Console
- Add billing to your Google Cloud project
- Restrict API key to your domain

### Phone Number Formatting Issues
- The app uses `libphonenumber-js` for formatting
- Supports international formats automatically
- Check console if specific country codes aren't working

### Exit Intent Too Sensitive/Not Triggering
- Adjust sensitivity in `useExitIntent.ts`
- Current threshold: Mouse within 50px of top of viewport
- Can be customized per your needs

## 🎨 Customization

### Modify Quiz Questions
Edit `components/quiz/QuizFunnel.tsx` and update the `questions` array:

```typescript
const questions = [
  { id: 'q1', text: 'Your custom question?', type: 'text' },
  // Add more questions...
]
```

### Change Animation Speed
Adjust typewriter speed in `useTypewriter.ts`:

```typescript
const typewriterSpeed = 50 // milliseconds per character
```

### Customize Theme Colors
Edit `app/globals.css` to change color scheme:

```css
:root {
  --primary: 222.2 47.4% 11.2%; /* Your brand color */
  --background: 0 0% 100%; /* Page background */
}
```

## 📊 Testing Checklist

- [ ] Quiz loads with typewriter animation
- [ ] All 7 questions appear in sequence
- [ ] Input fields lock until answer provided
- [ ] Exit intent modal triggers when leaving
- [ ] Signup modal collects all required data
- [ ] Phone number formats correctly
- [ ] Address autocomplete works
- [ ] Google OAuth sign-in functions
- [ ] Email/password login works
- [ ] Protected routes redirect when not authenticated
- [ ] Dashboard loads after authentication
- [ ] Quiz answers persist through signup

## 🔐 Security Considerations

1. **Environment Variables**: Never commit `.env.local` to git
2. **API Keys**: Restrict Google Places API key to your domain
3. **Firebase Rules**: Set up Firestore security rules
4. **CORS**: Configure allowed origins in Firebase console
5. **Token Management**: Auth tokens stored securely in httpOnly cookies

## 🚦 Next Steps

1. **Configure Firebase Firestore** to store quiz answers
2. **Set up meeting scheduler** integration (Calendly/Cal.com)
3. **Implement email notifications** for new signups
4. **Add analytics** to track quiz completion rates
5. **A/B test** different question sequences
6. **Optimize performance** for mobile devices
7. **Add progress saving** to allow users to return later

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Verify all environment variables are set
3. Ensure Firebase project is properly configured
4. Review this setup guide carefully

For authentication issues, check Firebase Console > Authentication > Users to see if accounts are being created.

---

**Built with:** Next.js 14, Firebase, Framer Motion, shadcn/ui, Tailwind CSS
