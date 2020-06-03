import { UserClient } from "@/network/clients";
import { useQuery } from "react-query";

const GET_TODOS = `
  query GetTodos {
    todos(where: {is_public: {_eq: true}}, order_by: {created_at: desc}, limit: 6) {
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

async function getTodosQuery() {
  const {
    data: {
      data: { todos = [] },
    },
  } = await UserClient({
    url: process.env.NEXT_PUBLIC_API_URL,
    data: {
      query: GET_TODOS,
    },
  });
  return todos;
}

export function useTodos() {
  return useQuery("todos", getTodosQuery, {
    retry: false,
    refetchOnWindowFocus: false,
  });
}
