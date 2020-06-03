import { useState } from "react";
import Layout from "@/components/layout";
import { TodoItem } from "@/components/todo-items";
import { useUserTodos } from "@/hooks/todos/usePrivateTodos";
import { useAddTodo } from "@/hooks/todos/useAddTodo";
import useAuthRedirect from "@/hooks/useAuthRedirect";
import { GUEST_USER } from "@/auth/user-management";

export default function PrivateTodosPage() {
  useAuthRedirect({ redirectIf: GUEST_USER, redirectTo: "/sign-up-in" });

  let [text, setTodo] = useState("");
  let { data = [] } = useUserTodos();
  let [mutate] = useAddTodo();

  const addTodo = () =>
    mutate(
      { text },
      {
        onSuccess: () => setTodo(""),
      }
    );

  return (
    <Layout>
      <div className="todos-page-container">
        <img className="todos-image" src="/private-todos.svg" alt="" />
        <div className="todos-list-container">
          <div className="add-todo-container">
            <input
              className="todo-item-input"
              placeholder="task..."
              name="todo-item"
              value={text}
              onChange={({ target: { value } }) => setTodo(value)}
            />
            <div className="add-todo-button" onClick={addTodo}>
              📎
            </div>
          </div>
          <div className="todos-list">
            <ul>
              {data.map((todo) => (
                <TodoItem
                  key={todo.id}
                  id={todo.id}
                  text={todo.text}
                  isCompleted={todo.is_completed}
                  isPublic={todo.is_public}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}
