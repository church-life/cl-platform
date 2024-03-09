// import axios from "axios";k
import { useAuth } from "@clerk/nextjs";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

import { client } from "@/lib/api";
import { paths } from "@/lib/api/v1";

type SignUpPayload = paths["/users"]["post"]["requestBody"]["content"]["application/json"];

export const useSignUp = (
  mutationOptions: UseMutationOptions<unknown, unknown, SignUpPayload, unknown> = {},
) => {
  const { getToken } = useAuth();
  return useMutation({
    ...mutationOptions,
    mutationFn: async (payload: SignUpPayload) => {
      const response = await client.POST("/users", {
        body: payload,
        headers: {
          authorization: `Bearer ${await getToken()}`,
        },
      });

      if (response.error) {
        throw new Error("Network response was not ok");
      }

      return response.data;
    },
  });
};
