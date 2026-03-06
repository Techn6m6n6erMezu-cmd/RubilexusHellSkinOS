import {
  getAllNPCs,
  getAllBuildings,
  getAllContent,
  updateNPC,
  createActivity,
  createRating,
  saveMagikMemory,
  type NPC,
  type Building,
  type Content,
} from './simWorldService';

/**
 * NPC Autonomy System - Sims-Style Behavior Logic
 * NPCs autonomously decide what to do based on personality, mood, energy, and preferences
 */

interface Decision {
  action: 'go_to_cinema' | 'go_to_arcade' | 'go_to_concert' | 'watch_movie' | 'play_game' | 'listen_concert' | 'rate_content' | 'idle';
  location?: string;
  contentId?: string;
  reason: string;
}

const PERSONALITY_WEIGHTS = {
  gamer: { arcade: 0.5, cinema: 0.2, concert: 0.2, idle: 0.1 },
  cinephile: { arcade: 0.1, cinema: 0.6, concert: 0.2, idle: 0.1 },
  music_lover: { arcade: 0.1, cinema: 0.2, concert: 0.6, idle: 0.1 },
  social: { arcade: 0.3, cinema: 0.3, concert: 0.3, idle: 0.1 },
  explorer: { arcade: 0.3, cinema: 0.3, concert: 0.3, idle: 0.1 },
  critic: { arcade: 0.25, cinema: 0.35, concert: 0.25, idle: 0.15 },
};

/**
 * Main autonomy tick - called periodically to update all NPCs
 */
export const runAutonomyTick = async (): Promise<void> => {
  console.log('%c[AUTONOMY]: Running NPC autonomy tick...', 'color: cyan; font-weight: bold;');

  const npcs = await getAllNPCs();
  const buildings = await getAllBuildings();
  const allContent = await getAllContent();

  for (const npc of npcs) {
    const decision = makeDecision(npc, buildings, allContent);
    await executeDecision(npc, decision, allContent);

    // Update mood and energy
    const newMood = Math.min(100, Math.max(0, npc.mood + (Math.random() * 10 - 4)));
    const newEnergy = Math.max(0, npc.energy - Math.random() * 5);

    await updateNPC(npc.id, {
      mood: Math.round(newMood),
      energy: Math.round(newEnergy),
      last_action_at: new Date().toISOString(),
    });
  }

  // Save world state to Magik Core
  await saveMagikMemory('world_event', {
    event: 'autonomy_tick',
    npc_count: npcs.length,
    timestamp: new Date().toISOString(),
  });

  console.log('%c[AUTONOMY]: Tick complete!', 'color: green; font-weight: bold;');
};

/**
 * Make an autonomous decision for an NPC
 */
const makeDecision = (npc: NPC, buildings: Building[], allContent: Content[]): Decision => {
  const weights = PERSONALITY_WEIGHTS[npc.personality];

  // Low energy = rest/idle
  if (npc.energy < 30) {
    return {
      action: 'idle',
      reason: 'Low energy, needs rest',
    };
  }

  // Determine where to go based on personality
  const rand = Math.random();
  let cumulative = 0;

  if (rand < (cumulative += weights.arcade)) {
    const arcade = buildings.find((b) => b.type === 'arcade');
    if (arcade) {
      return {
        action: 'go_to_arcade',
        location: arcade.name,
        reason: `${npc.personality} personality loves gaming`,
      };
    }
  } else if (rand < (cumulative += weights.cinema)) {
    const cinema = buildings.find((b) => b.type === 'pumpkin_cinema');
    if (cinema) {
      return {
        action: 'go_to_cinema',
        location: cinema.name,
        reason: `${npc.personality} personality wants to watch movies`,
      };
    }
  } else if (rand < (cumulative += weights.concert)) {
    const stage = buildings.find((b) => b.type === 'concert_stage');
    if (stage) {
      return {
        action: 'go_to_concert',
        location: stage.name,
        reason: `${npc.personality} personality loves live music`,
      };
    }
  }

  return {
    action: 'idle',
    reason: 'Default idle state',
  };
};

/**
 * Execute the decision made by the NPC
 */
const executeDecision = async (
  npc: NPC,
  decision: Decision,
  allContent: Content[]
): Promise<void> => {
  // Update NPC location
  if (decision.location) {
    await updateNPC(npc.id, {
      current_location: decision.location,
      current_activity: decision.action.replace('go_to_', 'at_'),
    });
  }

  // Create activity
  const buildingName = decision.location || npc.current_location;

  switch (decision.action) {
    case 'go_to_cinema':
      await consumeContent(npc, allContent, 'movie');
      break;
    case 'go_to_arcade':
      await consumeContent(npc, allContent, 'game');
      break;
    case 'go_to_concert':
      await consumeContent(npc, allContent, 'concert');
      break;
    default:
      await createActivity({
        npc_id: npc.id,
        activity_type: 'idle',
        outcome: { decision: decision.reason },
      });
  }

  console.log(
    `%c[${npc.name}]: ${decision.reason} → ${decision.action}`,
    'color: #888;'
  );
};

/**
 * NPC consumes content and potentially rates it
 */
const consumeContent = async (
  npc: NPC,
  allContent: Content[],
  contentType: 'movie' | 'game' | 'concert'
): Promise<void> => {
  const availableContent = allContent.filter((c) => c.type === contentType);

  if (availableContent.length === 0) return;

  // Pick random content
  const content = availableContent[Math.floor(Math.random() * availableContent.length)];

  // Create consumption activity
  const activity = await createActivity({
    npc_id: npc.id,
    content_id: content.id,
    activity_type: contentType === 'movie' ? 'watching' : contentType === 'game' ? 'playing' : 'listening',
    outcome: {
      content_title: content.title,
      enjoyed: true,
    },
  });

  // 70% chance to rate after consuming
  if (Math.random() < 0.7) {
    await rateContent(npc, content);
  }

  await updateNPC(npc.id, {
    current_activity: `enjoying ${content.title}`,
  });
};

/**
 * NPC rates content based on personality and preferences
 */
const rateContent = async (npc: NPC, content: Content): Promise<void> => {
  // Base rating (1-5)
  let rating = 3;

  // Adjust based on personality
  const personalityBonus = {
    gamer: content.type === 'game' ? 1 : 0,
    cinephile: content.type === 'movie' ? 1 : 0,
    music_lover: content.type === 'concert' ? 1 : 0,
    critic: -1, // Critics are harsher
    social: 0.5,
    explorer: 0.5,
  };

  rating += personalityBonus[npc.personality] || 0;

  // Add randomness
  rating += Math.random() * 2 - 1;

  // Clamp to 1-5
  rating = Math.max(1, Math.min(5, Math.round(rating)));

  // Generate comment
  const comments = generateComment(npc, content, rating);

  // Save rating
  await createRating(npc.id, content.id, rating, comments);

  // Save to Magik Core
  await saveMagikMemory('rating', {
    npc: npc.name,
    content: content.title,
    rating,
    comment: comments,
    timestamp: new Date().toISOString(),
  });

  console.log(
    `%c[${npc.name}]: Rated "${content.title}" - ${rating} stars - "${comments}"`,
    'color: gold;'
  );
};

/**
 * Generate contextual comment for rating
 */
const generateComment = (npc: NPC, content: Content, rating: number): string => {
  const positiveComments = [
    `Amazing! Love the ${content.metadata?.genre || 'style'}!`,
    `This is exactly what I needed. Pure fire! 🔥`,
    `Best ${content.type} I've experienced in ages!`,
    `Absolutely fantastic! Would recommend to everyone!`,
    `This is a masterpiece! ${rating} stars well deserved!`,
  ];

  const neutralComments = [
    `It was okay. Nothing special but not bad either.`,
    `Decent ${content.type}. Could be better.`,
    `Average experience. Has potential though.`,
    `Not my favorite but I can see why others like it.`,
    `Pretty standard. Nothing groundbreaking.`,
  ];

  const negativeComments = [
    `Not impressed. Expected more from this.`,
    `Disappointing. Needs major improvements.`,
    `Waste of time honestly. Skip this one.`,
    `Could barely finish it. Not good.`,
    `Severely overrated. Don't believe the hype.`,
  ];

  if (rating >= 4) {
    return positiveComments[Math.floor(Math.random() * positiveComments.length)];
  } else if (rating >= 3) {
    return neutralComments[Math.floor(Math.random() * neutralComments.length)];
  } else {
    return negativeComments[Math.floor(Math.random() * negativeComments.length)];
  }
};

/**
 * Get current status of all NPCs
 */
export const getNPCStatus = async (): Promise<string[]> => {
  const npcs = await getAllNPCs();
  return npcs.map(
    (npc) =>
      `${npc.name} (${npc.personality}) - ${npc.current_activity} @ ${npc.current_location} [Mood: ${npc.mood}% | Energy: ${npc.energy}%]`
  );
};

/**
 * Start autonomy loop (call this to begin simulation)
 */
export const startAutonomy = (intervalMs: number = 10000): NodeJS.Timeout => {
  console.log(
    '%c[AUTONOMY SYSTEM]: Starting NPC autonomy with Sims-style behavior...',
    'color: cyan; font-weight: bold; font-size: 14px;'
  );

  // Initial tick
  runAutonomyTick();

  // Set up interval
  return setInterval(() => {
    runAutonomyTick();
  }, intervalMs);
};

/**
 * Stop autonomy loop
 */
export const stopAutonomy = (intervalId: NodeJS.Timeout): void => {
  clearInterval(intervalId);
  console.log('%c[AUTONOMY SYSTEM]: Stopped.', 'color: orange; font-weight: bold;');
};
