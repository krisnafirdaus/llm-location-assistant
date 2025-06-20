# 🎨 Frontend - LLM Location Assistant

Modern Next.js 15 frontend dengan TypeScript, Tailwind CSS, dan Framer Motion untuk LLM Location Assistant.

## 🏗️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **HTTP Client**: Native fetch API
- **Build Tool**: Turbopack (dev mode)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Homepage
│   ├── layout.tsx         # Root layout
│   ├── auth/              # Authentication pages
│   │   └── page.tsx       # Sign-in page
│   └── chat/              # Chat interface
│       └── page.tsx       # Chat page
├── components/            # Reusable React components
│   ├── auth/              # Authentication components
│   │   ├── SignIn.tsx     # Sign-in form
│   │   ├── Dashboard.tsx  # User dashboard
│   │   └── AuthFlow.tsx   # Auth state management
│   ├── chat/              # Chat components
│   │   ├── ChatSetup.tsx     # Chat configuration
│   │   └── ChatConversation.tsx  # Chat interface
│   ├── Header.tsx         # Navigation header
│   ├── HealthStatus.tsx   # Backend health indicator
│   └── PlaceResults.tsx   # Google Maps results display
└── services/              # API & utilities
    └── api.ts             # Backend API client
```

## 🚀 Getting Started

### Development Mode

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Or use the script
chmod +x start-frontend.sh
./start-frontend.sh
```

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start

# Or build and preview
npm run build && npm run preview
```

### Docker

```bash
# Build container
docker build -t llm-frontend .

# Run container
docker run -p 3000:3000 llm-frontend
```

## 🎯 Features

### 🎨 Modern UI/UX
- **Gradient Design**: Beautiful purple-blue gradient backgrounds
- **Glass Morphism**: Frosted glass effects dengan backdrop-blur
- **Responsive Layout**: Mobile-first design yang adaptif
- **Smooth Animations**: Powered by Framer Motion

### 💬 Interactive Chat
- **Real-time Messaging**: Live chat dengan LLM backend
- **Message History**: Persistent chat history dalam session
- **Typing Indicators**: Visual feedback saat memproses
- **Auto-scroll**: Otomatis scroll ke pesan terbaru

### 🗺️ Maps Integration
- **Place Results**: Display hasil pencarian dari Google Places
- **Interactive Cards**: Card design untuk setiap lokasi
- **Rating & Reviews**: Tampilkan rating dan jumlah review
- **Opening Hours**: Status buka/tutup tempat

### 📱 Responsive Design
- **Mobile-First**: Dioptimalkan untuk mobile experience
- **Touch-Friendly**: Button dan interactive elements yang mudah diakses
- **Adaptive Layout**: Layout menyesuaikan ukuran layar
- **Cross-Platform**: Consistent experience di semua device

## 🔧 Configuration

### Environment Variables

Create `.env.local`:
```bash
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:5000

# Optional: Environment indicator
NEXT_PUBLIC_ENVIRONMENT=development
```

### Tailwind Configuration

Custom configuration di `tailwind.config.ts`:
- Custom colors untuk gradient themes
- Typography utilities
- Animation extensions

### TypeScript Configuration

Strict TypeScript setup dengan:
- Strict type checking
- Path mapping untuk clean imports
- Next.js specific types

## 🎪 Components Guide

### Authentication Flow
```tsx
import { AuthFlow } from '@/components/auth/AuthFlow'

// Simple authentication state management
<AuthFlow onAuthSuccess={(user) => console.log(user)} />
```

### Chat Interface
```tsx
import { ChatConversation } from '@/components/chat/ChatConversation'

// Full-featured chat with backend integration
<ChatConversation apiUrl="http://localhost:5000" />
```

### Place Results Display
```tsx
import { PlaceResults } from '@/components/PlaceResults'

// Display Google Places results
<PlaceResults places={placesData} onPlaceSelect={handleSelect} />
```

## 🎨 Styling Guide

### Color Palette
```css
/* Primary gradients */
bg-gradient-to-br from-purple-400 via-pink-500 to-red-500
bg-gradient-to-r from-blue-500 to-purple-600

/* Glass morphism */
bg-white/10 backdrop-blur-md border border-white/20

/* Text colors */
text-gray-800 /* Dark text */
text-white    /* Light text */
text-gray-600 /* Muted text */
```

### Component Patterns
```tsx
// Standard card component
<div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6">
  {/* Content */}
</div>

// Button variants
<button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:scale-105 transition-transform">
  Action Button
</button>
```

## 🧪 Testing

```bash
# Run tests (when configured)
npm test

# Type checking
npm run type-check

# Linting
npm run lint

# Lint and fix
npm run lint:fix
```

## 📦 Scripts

- `npm run dev` - Start development server dengan Turbopack
- `npm run build` - Build production bundle
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - TypeScript type checking

## 🚀 Performance Optimizations

### Next.js Features
- **App Router**: Modern routing dengan streaming
- **Server Components**: Reduced client-side JavaScript
- **Image Optimization**: Automatic image optimization
- **Code Splitting**: Automatic route-based splitting

### Custom Optimizations
- **Lazy Loading**: Components loaded on demand
- **Debounced Inputs**: Prevent excessive API calls
- **Memoized Components**: React.memo untuk expensive renders
- **Efficient State**: Minimal state updates

## 🔗 Integration with Backend

API client di `src/services/api.ts` handles:
- ✅ Error handling dengan proper typing
- ✅ Request/response interceptors
- ✅ Automatic retry logic
- ✅ Loading states management

Example usage:
```tsx
import { apiClient } from '@/services/api'

const searchPlaces = async (query: string) => {
  try {
    const response = await apiClient.get(`/api/places?query=${query}`)
    return response.data
  } catch (error) {
    console.error('Search failed:', error)
  }
}
```

## 🛠️ Development Tips

1. **Hot Reload**: Turbopack memberikan instant updates
2. **Component Dev**: Gunakan React DevTools
3. **Style Debug**: Tailwind CSS IntelliSense extension
4. **Type Safety**: Leverage TypeScript untuk better DX

## 📱 Mobile Considerations

- Touch targets minimal 44px
- Readable text minimal 16px
- Sufficient color contrast
- Accessible navigation
- Optimized animations untuk mobile

Frontend siap untuk development dan production! 🎉

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
