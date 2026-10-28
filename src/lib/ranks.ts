import { RANKS, TOTAL_LEVELS } from "@/config";

export const LEVELS_PER_RANK = Math.round(TOTAL_LEVELS / RANKS.length);
export const FIRST_RANK = RANKS[0];
export const LAST_RANK = RANKS[RANKS.length - 1];
