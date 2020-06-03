import { UserClient } from "@/network/clients";

export async function loginUserRequest(variables) {
  const { data } = await UserClient({
    url: "/api/login",
    data: variables,
  });
  return data;
}
