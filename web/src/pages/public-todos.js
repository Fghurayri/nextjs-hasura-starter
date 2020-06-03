import Layout from "@/components/layout";
import { TodoItem } from "@/components/todo-items";
import { useTodos } from "@/hooks/todos/usePublicTodos";

export default function PublicTodosPage() {
  let { data = [] } = useTodos();
  return (
    <Layout>
      <div className="todos-page-container">
        <img className="todos-image" src="/public-todos.svg" alt="" />
        <div className="todos-list-container">
          <div className="todos-list">
            <ul>
              {data.map((todo) => (
                <TodoItem
                  hideToggles
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
