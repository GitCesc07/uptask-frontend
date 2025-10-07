import type { Task } from "@/types/index"
import Taskcard from "./Taskcard"
import TasksEmpty from "../ui-notfound/TasksEmpty"
import { statusTranslations } from "@/locales/es"

type TaskListProps = {
    tasks: Task[]
    canEdit: boolean
}

type GroupedTask = {
    [key: string] : Task[]
}

const initialStatusGroups: GroupedTask = {
  pending: [],
  onHold: [],
  inProgress: [],
  underReview: [],
  complete: [],
};


const statusStyles: { [key: string]: string } = {
  pending: "border-t-slate-500",
  onHold: "border-t-red-500",
  inProgress: "border-t-amber-400",
  underReview: "border-t-cyan-700",
  complete: "border-t-green-500",
};

export default function TaskList({tasks, canEdit} : TaskListProps) {

        const groupedTasks = tasks.reduce((acc, task) => {
          let currentGroup = acc[task.status] ? [...acc[task.status]] : [];
          currentGroup = [...currentGroup, task];
          return { ...acc, [task.status]: currentGroup };
        }, initialStatusGroups);

  return (
    <>
      <h2 className="text-5xl font-black my-10">Tareas</h2>

      <div className="flex gap-5 md:h-[40rem] h-96 overflow-x-scroll overflow-y-scroll 2xl:overflow-auto pb-10">
        {Object.entries(groupedTasks).map(([status, tasks]) => (
          <div
            key={status}
            className="min-w-[300px] 2xl:min-w-0 2xl:w-1/5"
          >
            <h3
              className={`capitalize text-xl top-0 sticky font-light border border-slate-300/75 bg-white p-3 border-t-8 ${statusStyles[status]}`}
            >
              {statusTranslations[status]}
            </h3>

            <ul className="mt-5 space-y-5">
              {tasks.length === 0 ? (
                <li className="text-gray-500 text-center pt-3">
                  <TasksEmpty />
                </li>
              ) : (
                tasks.map((task) => <Taskcard key={task._id} task={task} canEdit={canEdit} />)
              )}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}
