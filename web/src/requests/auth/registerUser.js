import { UserClient } from "@/network/clients";

export async function registerUserRequest(variables) {
  const { data } = await UserClient({
    url: "/api/register",
    data: variables,
  });
  return data;
}
