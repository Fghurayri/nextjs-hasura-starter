import { useMutation, queryCache } from "react-query";
import { UserClient } from "@/network/clients";

const TOGGLE_TODO_COMPLETED = `
  mutation ToggleTodo($id: bigint!, $is_completed: Boolean!) {
    update_todos_by_pk(pk_columns: {id: $id}, _set: {is_completed: $is_completed}) {
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

async function toggleTodoCompletedQuery(variables) {
  await UserClient({
    url: process.env.NEXT_PUBLIC_API_URL,
    data: {
      query: TOGGLE_TODO_COMPLETED,
      variables: {
        ...variables,
      },
    },
  });
}

export function useToggleTodoCompleted() {
  return useMutation(toggleTodoCompletedQuery, {
    onSuccess: () => queryCache.refetchQueries("todos"),
  });
}

const TOGGLE_TODO_PUBLIC = `
  mutation ToggleTodo($id: bigint!, $is_public: Boolean!) {
    update_todos_by_pk(pk_columns: {id: $id}, _set: {is_public: $is_public}) {
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

async function toggleTodoPublicQuery(variables) {
  await UserClient({
    url: process.env.NEXT_PUBLIC_API_URL,
    data: {
      query: TOGGLE_TODO_PUBLIC,
      variables: {
        ...variables,
      },
    },
  });
}

export function useToggleTodoPublic() {
  return useMutation(toggleTodoPublicQuery, {
    onSuccess: () => queryCache.refetchQueries("todos"),
  });
}
