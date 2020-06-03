import {
  useToggleTodoCompleted,
  useToggleTodoPublic,
} from "@/hooks/todos/useToggleTodo";

export function TodoItem({
  id,
  text,
  isCompleted,
  isPublic,
  hideToggles = false,
}) {
  let [doToggleCompleted] = useToggleTodoCompleted();
  let [doTogglePublic] = useToggleTodoPublic();

  const toggleCompleted = () =>
    doToggleCompleted({ id, is_completed: !isCompleted });

  const togglePublic = () => doTogglePublic({ id, is_public: !isPublic });

  return (
    <li className="todo-item">
      {hideToggles ? null : (
        <>
          <span
            style={{ cursor: "pointer", marginRight: 10 }}
            onClick={togglePublic}
          >
            {isPublic ? "👁" : "🙈"}
          </span>
          <input
            type="checkbox"
            checked={isCompleted}
            onChange={toggleCompleted}
          />
        </>
      )}

      {isCompleted ? <s>{text}</s> : text}
    </li>
  );
}
