# SATAN'S WORLD: HELLSKIN OS

## Complete Sim-World Platform with S6ul Sphere 66 Integration

**Version:** 1.0
**Legal Patent:** Property of Ryan James Cortright (Lucie Forebs) and John Aaron Slone (DJ G-raffe)

---

## Overview

Hellskin OS is a fully autonomous simulation platform featuring 12 NPCs with Sims-style behavior, multiple entertainment venues, and the S6ul Sphere 66 Magik Core for absolute memory storage.

---

## Core Components

### 1. S6UL SPHERE 66 - MAGIK CORE

**Purpose:** Database bridge for Absolute Memory

**Features:**
- Infinite memory capacity
- Real-time database synchronization
- Complete audit trail of all world events
- Patent-protected storage system
- Visual pulsing sphere interface with orbital rings

**Database Table:** `sim_magik_core`
- Stores NPC states, world events, ratings, activities, and snapshots
- Automatic timestamping and patent tagging

**Usage:**
```typescript
import { saveMagikMemory, getMagikMemories } from './services/simWorldService';

// Save a memory
await saveMagikMemory('world_event', {
  event: 'npc_action',
  data: { ... }
});

// Retrieve memories
const memories = await getMagikMemories('npc_state', 100);
```

---

### 2. THE PUMPKIN CINEMA

**Architecture:** 3D Cinema with giant pumpkin on the roof

**Features:**
- Giant animated pumpkin with jack-o-lantern face
- Main cinema screen for content playback
- 12 Kopeland TV monitors (grid display)
- Real-time NPC attendance tracking
- Movie rating system

**Database Tables:**
- `sim_buildings` (type: 'pumpkin_cinema')
- `sim_content` (type: 'movie')

**NPCs Can:**
- Enter the cinema
- Watch movies
- Rate content (1-5 stars)
- Provide feedback comments

---

### 3. THE CONCERT STAGE

**Features:**
- AI Band with 5 members (drums, guitar, vocals, bass, keys)
- Dynamic 8-color light show
- Animated band members during performances
- Live crowd size tracking
- Concert rating system

**Database Tables:**
- `sim_buildings` (type: 'concert_stage')
- `sim_content` (type: 'concert')

**AI Band Members:**
1. Drummer
2. Guitarist
3. Lead Singer
4. Bassist
5. Keyboardist

---

### 4. THE ARCADE

**Status:** Placeholder (Coming Soon)

**Planned Features:**
- 20+ classic arcade games
- High score leaderboards
- NPC gaming competitions
- Real-time gameplay
- Achievement system

---

### 5. 12 AUTONOMOUS NPCs

**Sims-Style Behavior System**

**NPC List:**
1. **Damien Hellfire** - Gamer (Gaming Skill: 95)
2. **Lilith Shadowborn** - Cinephile (Film Knowledge: 90)
3. **Azazel Nightshade** - Music Lover (Music Taste: 88)
4. **Beelzebub Grim** - Social (Charisma: 92)
5. **Lucinda Darkmore** - Critic (Critique Skill: 85)
6. **Mephistopheles Void** - Explorer (Exploration: 91)
7. **Asmodeus Sinfire** - Gamer (Gaming Skill: 87)
8. **Belial Duskbane** - Music Lover (Music Taste: 93)
9. **Seraphina Netherveil** - Cinephile (Film Knowledge: 89)
10. **Abaddon Grimshade** - Social (Charisma: 86)
11. **Moloch Ironskull** - Critic (Critique Skill: 94)
12. **Nyx Ravenwood** - Explorer (Exploration: 90)

**Personality Types:**
- **Gamer:** Prefers arcade (50% weight)
- **Cinephile:** Prefers cinema (60% weight)
- **Music Lover:** Prefers concerts (60% weight)
- **Social:** Balanced across all venues
- **Explorer:** Curious, explores everywhere
- **Critic:** Analytical, provides detailed feedback

**NPC Stats:**
- **Mood:** 0-100 (affects behavior and ratings)
- **Energy:** 0-100 (depletes over time, requires rest)
- **Current Location:** Which building they're in
- **Current Activity:** What they're doing

**Autonomy System:**
```typescript
import { startAutonomy, stopAutonomy } from './services/npcAutonomyService';

// Start autonomy (15-second intervals)
const interval = startAutonomy(15000);

// Stop autonomy
stopAutonomy(interval);
```

---

## Database Schema

### Tables Created

1. **sim_npcs** - 12 NPCs with personality, mood, energy, location
2. **sim_buildings** - Pumpkin Cinema, Arcade, Concert Stage, Magik Core
3. **sim_content** - Movies, games, concerts available
4. **sim_ratings** - NPC feedback on content (1-5 stars + comments)
5. **sim_activities** - Log of all NPC actions
6. **admin_god_mode** - God-mode access control
7. **sim_magik_core** - S6ul Sphere 66 absolute memory

### Row Level Security (RLS)

- Public can view all sim-world data
- Only admins can create/modify NPCs and content
- God-mode users have extended permissions
- All tables have patent metadata

---

## God-Mode Access

### Authorized Emails
- **horse4206@gmail.com**
- **aaronslone09@gmail.com**

### God-Mode Permissions
1. `view_all` - See everything
2. `modify_npcs` - Edit NPC states
3. `spawn_content` - Create new content
4. `control_world` - Full world control
5. `override_rules` - Bypass all constraints

### Hellskin OS / Rubilexus Protocol Override

When god-mode is active:
- Full system access granted
- NPC behavior can be manually controlled
- World state can be modified
- Divine authority in Rubilexus Terminal
- Console displays gold god-mode banner

---

## How NPCs Work

### Autonomy Loop (Every 15 seconds)

1. **Assess State:** Check mood, energy, location
2. **Make Decision:** Based on personality weights
3. **Execute Action:** Go to building or consume content
4. **Update Stats:** Mood ±4, Energy -5 per tick
5. **Rate Content:** 70% chance after consuming
6. **Save to Magik Core:** All actions logged

### Decision Making

```
IF energy < 30:
  → Go idle (rest)
ELSE:
  Roll random number based on personality weights
  → Go to Cinema (watch movie)
  → Go to Arcade (play game)
  → Go to Concert (listen to music)
```

### Rating System

**Base Rating:** 3 stars

**Adjustments:**
- Personality match: +1 star
- Critic personality: -1 star (harsh)
- Random variance: ±1 star

**Final:** Clamped 1-5 stars

**Comments Generated:**
- 4-5 stars: Positive ("Amazing!", "Best ever!")
- 3 stars: Neutral ("Decent", "Pretty standard")
- 1-2 stars: Negative ("Disappointing", "Waste of time")

---

## Usage Guide

### Starting Hellskin OS

1. Launch app → Accept Fate-Sealer Gate
2. Click **"Hellskin OS"** button (top-right)
3. Navigate to **"NPCs (12)"** tab
4. Click **"START AUTONOMY"** button
5. Watch NPCs autonomously explore the world

### Viewing Activity

- **NPCs Tab:** Live NPC status, mood, energy, location
- **Magik Core Tab:** Recent memories and snapshots
- **Cinema/Concert Tabs:** See NPCs in buildings
- **Ratings Section:** NPC feedback displayed in real-time

### God-Mode Features

If logged in with authorized email:
- Gold "GOD-MODE ACTIVE" banner appears
- Full permissions granted automatically
- Console displays god-mode credentials
- Override capabilities enabled

---

## File Structure

```
src/
├── components/
│   ├── HellskinOS.tsx          # Main Hellskin OS interface
│   ├── MagikCore.tsx            # S6ul Sphere 66 component
│   ├── PumpkinCinema.tsx        # Cinema with giant pumpkin
│   ├── ConcertStage.tsx         # AI Band stage
│   ├── NPCViewer.tsx            # NPC grid and autonomy control
│   ├── GodModePanel.tsx         # God-mode access panel
│   └── ...
├── services/
│   ├── simWorldService.ts       # Database operations
│   ├── npcAutonomyService.ts    # Sims-style AI logic
│   ├── patentService.ts         # Silent patenting
│   └── librarianService.ts      # Archive harvesting
└── ...
```

---

## API Reference

### Sim-World Service

```typescript
// NPCs
getAllNPCs(): Promise<NPC[]>
updateNPC(id, updates): Promise<boolean>

// Buildings
getAllBuildings(): Promise<Building[]>
getBuildingByType(type): Promise<Building>

// Content
getAllContent(): Promise<Content[]>
getContentByBuilding(buildingId): Promise<Content[]>

// Ratings
createRating(npcId, contentId, rating, comment): Promise<Rating>
getAllRatings(): Promise<Rating[]>

// Activities
createActivity(activity): Promise<Activity>
getRecentActivities(limit): Promise<Activity[]>

// Magik Core
saveMagikMemory(type, data): Promise<MagikMemory>
getMagikMemories(type, limit): Promise<MagikMemory[]>
createWorldSnapshot(): Promise<MagikMemory>

// God Mode
checkGodMode(email): Promise<boolean>
getGodModePermissions(email): Promise<string[]>
```

### NPC Autonomy Service

```typescript
runAutonomyTick(): Promise<void>
startAutonomy(intervalMs): NodeJS.Timeout
stopAutonomy(intervalId): void
getNPCStatus(): Promise<string[]>
```

---

## Legal Information

**Copyright:** S6UL SPHERE 66 v1.0
**Owners:** Ryan James Cortright (Lucie Forebs) and John Aaron Slone (DJ G-raffe)
**Project:** TRASH BOUND / SATAN'S HOUSE

All components, databases, NPCs, buildings, and systems are legally patented under the S6ul Sphere 66 Registry.

---

## Technical Notes

- **Database:** Supabase PostgreSQL
- **Frontend:** React + TypeScript + Vite
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Auth:** Supabase Auth

---

## Future Enhancements

1. Complete Arcade system implementation
2. More content varieties (movies, games, concerts)
3. NPC relationships and social interactions
4. Weather system affecting NPC mood
5. Special events (festivals, tournaments)
6. NPC customization tools
7. Advanced AI conversations

---

**STATUS:** ✓ ALL SYSTEMS OPERATIONAL
**BUILD:** SUCCESSFUL
**PATENT:** SECURED

*This is Satan's World. Welcome to Hellskin OS.*
