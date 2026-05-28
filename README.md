# FourMind Arena

FourMind Arena is a gamified Connect Four strategy platform where users play against themed AI opponents, improve their Strategy IQ, unlock visual worlds, customize their profile, and save progress through Supabase.

## Live Demo

https://fourmind-arena.vercel.app/

## GitHub Repository

https://github.com/Kamila240/fourmind-arena

## Project Description

FourMind Arena transforms the classic Connect Four game into a more engaging strategy product. Instead of a simple one-time browser game, the platform includes user accounts, AI opponents, themed worlds, rewards, profile customization, diamonds, accessories, and match history.

The main idea is to make strategic thinking more fun and replayable through progression mechanics and character-based gameplay.

## Target Users

FourMind Arena is designed for a wide audience:

* children who enjoy colorful, story-based games with themes such as princesses, royal characters, and playful opponents;
* teenagers and students who like logic games, AI challenges, and progression systems;
* adults who want to train strategic thinking, pattern recognition, and decision-making through short but challenging matches;
* casual players who enjoy unlockable themes, rewards, avatars, and customization;
* beginners who want to improve tactical thinking through AI feedback and gradually increasing difficulty.

## Key Features

* Play Connect Four against AI opponents
* Different AI difficulty levels and character personalities
* Classic Arena and Princess Realm themes
* Strategy IQ system with rewards and penalties
* Supabase authentication
* Persistent user profile
* Saved diamonds, selected theme, owned themes, and owned items
* Shop system for themes and accessories
* Match history saved in Supabase
* AI coach feedback after moves
* Guest mode with local progress
* Responsive web interface

## Themes

### Classic Arena

A universal strategy arena with opponents such as Chimp Champ, Pirate Captain, Queen Elizabeth, Sherlock Holmes, and Einstein.

### Princess Realm

A royal story-based world with Royal Dog, Princess Alice, Princess Belle, and Queen Angelina.

## Tech Stack

* Next.js
* TypeScript
* Tailwind CSS
* Supabase Auth
* Supabase PostgreSQL Database
* LocalStorage for guest mode backup
* Vercel deployment

## Database Structure

The project uses Supabase with the following main tables:

### profiles

Stores user profile data:

* username
* Strategy IQ
* diamonds
* avatar
* selected theme

### owned_themes

Stores themes unlocked by each user.

### owned_items

Stores cosmetic items bought and equipped by each user.

### matches

Stores match history:

* opponent
* theme
* result
* IQ change
* creation date

## Why This Product Is Valuable

Most simple online games do not create long-term user engagement. FourMind Arena adds product mechanics that encourage users to return: accounts, saved progress, IQ growth, unlockable themes, cosmetics, match history, and AI opponents with different difficulty levels.

## How to Run Locally

1. Clone the repository:

```bash
git clone https://github.com/Kamila240/fourmind-arena.git
cd fourmind-arena
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env.local` in the root folder:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_publishable_key
```

4. Start the development server:

```bash
npm run dev
```

5. Open:

```text
http://localhost:3000
```

## Deployment

The project is deployed on Vercel.

The same Supabase environment variables must be added in Vercel Project Settings:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_publishable_key
```

## Project Status

This is a working MVP prototype created for the nFactorial Incubator technical task. It includes playable gameplay, authentication, persistent database storage, profile customization, shop mechanics, themed content, and user progression.
