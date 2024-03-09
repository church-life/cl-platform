import createClient from "openapi-fetch";

import { env } from "@/env";

import type { components, paths } from "./v1";

export const client = createClient<paths>({ baseUrl: env.NEXT_PUBLIC_API_URL });
export type { components, paths };
