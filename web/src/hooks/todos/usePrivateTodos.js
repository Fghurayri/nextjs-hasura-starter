import { useQuery } from "react-query";
import { getUserIdFromAccessToken } from "@/auth/user-management";
import { UserClient } from "@/network/clients";
import { inMemoryTokenAPI } from "@/auth/tokens-management";

const GET_USER_TODOS = `
  query GetUserTodos($id: bigint!) {
    todos(where: {author_id: {_eq: $id}}, order_by: {created_at: desc}, limit: 6) {
      author_id
      created_at
      id
      is_completed
      is_public
      text
      updated_at
    }
  }
`;

async function getUserTodosQuery(_, { userId }) {
  const {
    data: {
      data: { todos = [] },
    },
  } = await UserClient({
    url: process.env.NEXT_PUBLIC_API_URL,
    data: {
      query: GET_USER_TODOS,
      variables: {
        id: userId,
      },
    },
  });
  return todos;
}

export function useUserTodos() {
  let inMemoryToken = inMemoryTokenAPI.getState().inMemoryToken;

  if (!inMemoryToken) {
    return {};
  }

  let userId = getUserIdFromAccessToken(inMemoryToken);
  return useQuery(["todos", { userId }], getUserTodosQuery, {
    retry: false,
    refetchOnWindowFocus: false,
  });
}
