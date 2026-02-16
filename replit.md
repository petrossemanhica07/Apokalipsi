# Apokalipsi - Replit Agent Guide

## Overview

Apokalipsi is a mobile-first Bible study application focused on the Book of Revelation (Apocalipse) in the Tsonga language (Xitsonga). The app presents 22 chapters of the Book of Revelation with full text content, audio playback, community comments via Firebase, and a favorites system. The interface is bilingual, using Tsonga for scripture content and Portuguese for UI labels and descriptions.

The project uses a dual architecture: an Expo/React Native frontend for cross-platform mobile and web support, paired with an Express.js backend server. The app has a warm, parchment-themed design aesthetic with cream/gold/brown colors meant to evoke an old book feel.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend (Expo/React Native)
- **Framework**: Expo SDK 54 with React Native 0.81, using the new architecture (`newArchEnabled: true`)
- **Routing**: expo-router v6 with file-based routing and typed routes. The app has a tab-based layout (`app/(tabs)/`) with three tabs: Home (index), Favorites, and Search. Chapter detail pages live at `app/chapter/[id].tsx`. There's also an About page at `app/about.tsx`.
- **State Management**: React Query (`@tanstack/react-query`) for server state, React's built-in `useState` for local state, and a custom React Context (`DrawerProvider`) for the side drawer menu.
- **Navigation Structure**: Tab navigator as the main navigation with a custom animated drawer menu overlay (not using React Navigation's drawer - it's a custom implementation using React Native's Animated API).
- **Fonts**: Playfair Display (bold/semibold) for headings and Inter (regular/medium/semibold) for body text, loaded via `@expo-google-fonts`.
- **Animations**: react-native-reanimated for smooth animations (e.g., audio player pulse effect).
- **Platform Handling**: The app handles iOS, Android, and web with platform-specific adjustments (e.g., web top/bottom insets, haptics only on native, blur effects on iOS tabs).

### Backend (Express.js)
- **Server**: Express v5 running on Node.js with TypeScript (compiled via tsx for dev, esbuild for production)
- **API Pattern**: Routes registered in `server/routes.ts`, prefixed with `/api`. Currently minimal - the server primarily serves as infrastructure for future API needs.
- **CORS**: Custom CORS middleware that handles Replit domains and localhost origins for Expo web development.
- **Storage**: In-memory storage (`MemStorage` class) implementing an `IStorage` interface with basic user CRUD operations. This is a placeholder pattern ready to be swapped for database-backed storage.
- **Static Serving**: In production, the server serves the Expo web build from a `dist/` directory.

### Data Layer
- **Chapter Content**: All 22 chapters of Revelation are stored as static data in `lib/chapters.ts` - not in a database. Each chapter has id, title (Tsonga), subtitle (Portuguese), summary, content, and verse count.
- **Favorites**: Stored locally on-device using `@react-native-async-storage/async-storage`. Simple array of chapter IDs persisted as JSON.
- **Comments**: Stored in Firebase Firestore (see External Dependencies). Comments have chapterId, author, text, and createdAt timestamp.
- **Database Schema**: Drizzle ORM with PostgreSQL is configured (`shared/schema.ts`) but currently only has a basic `users` table. The database is not heavily used yet - the schema exists as scaffolding. Drizzle config points to `DATABASE_URL` environment variable.

### Build & Deployment
- **Development**: Two processes run simultaneously - Expo dev server (`expo:dev`) and Express server (`server:dev`)
- **Production Build**: Custom build script (`scripts/build.js`) handles Expo static web export, then Express serves the built files
- **Server Build**: esbuild bundles the server TypeScript into `server_dist/`
- **Database Migrations**: Drizzle Kit configured for push-based migrations (`db:push` script)

## External Dependencies

### Firebase (Firestore)
- **Purpose**: Community comments system for each chapter
- **Project**: `nhlavutelo-comments` 
- **Config**: Hardcoded in `lib/firebase.ts` (API key, project ID, etc.)
- **Collections**: `comments` collection with fields: `chapterId` (number), `author` (string), `text` (string), `createdAt` (timestamp)
- **Queries**: Filter by chapterId, order by createdAt descending

### PostgreSQL (via Drizzle ORM)
- **Purpose**: Server-side data persistence (currently minimal - just a users table)
- **Config**: `DATABASE_URL` environment variable required
- **Schema**: Defined in `shared/schema.ts`, migrations output to `./migrations`
- **Validation**: drizzle-zod generates Zod schemas from Drizzle table definitions

### Audio Content
- **Source**: External audio files served from `https://sksalon70.infy.uk/musica{chapterId}`
- **Playback**: expo-audio module with play/pause controls and progress tracking

### WhatsApp Contact
- **Purpose**: Contact link in the drawer menu and about page
- **Phone**: +258849275780 (Mozambique number)
- **Integration**: Simple `Linking.openURL` to WhatsApp web API