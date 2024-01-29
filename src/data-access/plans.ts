import { queryOptions } from "@tanstack/react-query";

const keys = {
  allPlans: ["plans"],
  onePlan: (planId: string) => ["plans", planId],
};

export const getAllPlansQueryOptions = queryOptions({
  queryKey: keys.allPlans,
  queryFn: fetchPlans,
});

export const onePlanQueryOptions = (planId: string) =>
  queryOptions({
    queryKey: keys.onePlan(planId),
    queryFn: () => fetchPlan(planId),
  });

export type PostType = {
  id: string;
  title: string;
  body: string;
};

export class PlanNotFoundError extends Error {}

type Plan = {
  id: string;
  title: string;
  songs: Song[];
};

type Song = {
  id: string;
  duration: number;
  title: string;
};

const mockedPlans: Plan[] = [
  {
    id: "1",
    title: "Plan 1",
    songs: [
      {
        id: "1",
        duration: 100,
        title: "Song 1",
      },
    ],
  },
  {
    id: "2",
    title: "Plan 2",
    songs: [
      {
        id: "2",
        duration: 220,
        title: "Song 2",
      },
    ],
  },
];

async function fetchPlans() {
  console.log("Fetching posts...");
  await new Promise((r) => setTimeout(r, 500));
  return mockedPlans;
}

export const fetchPlan = async (postId: string) => {
  console.log(`Fetching plan with id ${postId}...`);
  await new Promise((r) => setTimeout(r, 500));
  const post = mockedPlans.find((p) => p.id === postId);
  if (!post) {
    throw new PlanNotFoundError(`Plan with id ${postId} not found`);
  }

  return post;
};
