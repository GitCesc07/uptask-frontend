import ImageTasksEmpty from "../imageUI/ImageTasksEmpty";

export default function TasksEmpty() {
  return (
    <div className="flex items-center flex-col justify-center">
      <ImageTasksEmpty />
      <p className="text-center mt-4 text-lg">
        Aún no hay tareas para mostrar...
      </p>
    </div>
  );
}
