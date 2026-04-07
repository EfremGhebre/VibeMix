# VibeMix - AI Playlist Intelligence

VibeMix is a mood-based music discovery app that creates playlist recommendations and lets users open them in their preferred platform.

## What VibeMix Does

VibeMix turns user intent into a quick listening path:

1. Choose mood
2. Choose language
3. (Optional) choose genre
4. Generate a mix
5. Open it in Spotify, Apple Music, or YouTube

## Core Concept

VibeMix is a discovery and recommendation layer, not a streaming service.

- Mood-first recommendations
- Language-aware mixes
- Fast, low-friction flow
- Platform-agnostic output

## Current Product Behavior

- Playlists are generated inside VibeMix and saved as "Saved Vibes"
- Users can open the generated mix context in external platforms
- No platform account connection is required for this flow

## Features

- Mood-based playlist generation
- Language-specific recommendations
- Optional genre filtering
- Smart playlist titles and descriptions
- Open in Spotify / Apple Music / YouTube
- Save generated mixes
- Light/dark mode
- Multi-language UI support

## Tech Stack

- Vite
- React + TypeScript
- Tailwind CSS + shadcn/ui
- Supabase

## Important Notes

- VibeMix does not stream music
- VibeMix does not host or store audio files
- VibeMix currently does not require Spotify OAuth connection

## Status

Active development - VibeMix v2 (AI Playlist Intelligence Layer)