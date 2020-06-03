import { useMutation, queryCache } from "react-query";
import { UserClient } from "@/network/clients";

const ADD_TODO = `
  mutation AddTodo($text: String!) {
    insert_todos_one(object: {text: $text}) {
      id
      author_id
      created_at
      is_completed
      is_public
      text
      updated_at
    }
  }
`;

async function addTodoQuery(variables) {
  await UserClient({
    url: process.env.NEXT_PUBLIC_API_URL,
    data: {
      query: ADD_TODO,
      variables: {
        ...variables,
      },
    },
  });
}

export function useAddTodo() {
  return useMutation(addTodoQuery, {
    onSuccess: () => queryCache.refetchQueries("todos"),
  });
}
