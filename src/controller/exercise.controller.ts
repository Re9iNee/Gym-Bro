import { Goal } from "@prisma/client";

export function isGoalValid(goal: Goal): boolean {
  return Object.values(Goal).includes(goal);
}
