import { Fragment } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Menu, Transition } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Task } from "@/types/index"
import { deleteTask } from "@/api/TaskAPI";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

type TaskcardProps = {
  task: Task
  canEdit: boolean
}

export default function Taskcard({ task, canEdit }: TaskcardProps) {

  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const params = useParams()
  const projectId = params.projectId!

  const { mutate } = useMutation({
    mutationFn: deleteTask,
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      toast.success(data)
    }
  })

  return (
    <li className="p-5 bg-white border border-slate-300 flex justify-between shadow-md shadow-slate-300/85">
      <div className="min-w-0 flex flex-col gap-y-4">
        <button
          className="text-lg font-bold text-slate-600 text-left"
          type="button"
          onClick={() =>
            navigate(location.pathname + `?viewTask=${task._id}`)
          }
        >
          {task.name}
        </button>
        <p className="text-slate-500">{task.description}</p>
      </div>

      <div className="flex shrink-0  gap-x-6">
        <Menu as="div" className="relative flex-none">
          <Menu.Button className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
            <span className="sr-only">opciones</span>
            <EllipsisVerticalIcon className="h-9 w-9" aria-hidden="true" />
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
              <Menu.Item>
                <button
                  type="button"
                  className="block px-3 py-1 text-sm leading-6 text-gray-900"
                  onClick={() =>
                    navigate(location.pathname + `?viewTask=${task._id}`)
                  }
                >
                  Ver Tarea
                </button>
              </Menu.Item>

              {
                canEdit &&
                (
                  <>
                    <Menu.Item>
                      <button
                        type="button"
                        className="block px-3 py-1 text-sm leading-6 text-gray-900"
                        onClick={() =>
                          navigate(location.pathname + `?editTask=${task._id}`)
                        }
                      >
                        Editar Tarea
                      </button>
                    </Menu.Item>

                    <Menu.Item>
                      <button
                        type="button"
                        className="block px-3 py-1 text-sm leading-6 text-red-500"
                        onClick={() => {
                          MySwal.fire({
                            title: "Eliminar tarea",
                            html: `
                    <p class="text-lg text-gray-600 text-center">
                      ¿Seguro deseas eliminar la tarea <span class="font-bold text-gray-900">${task.name}</span>?
                    </p>
                  `,
                            icon: "question",
                            showCancelButton: true,
                            cancelButtonColor: "#d33",
                            cancelButtonText: "No, eliminar!",
                            confirmButtonColor: "#3085d6",
                            confirmButtonText: "Si, eliminarla!",
                          }).then((result) => {
                            if (result.isConfirmed) {
                              mutate({ projectId, taskId: task._id });
                            }
                          });
                        }}
                      >
                        Eliminar Tarea
                      </button>
                    </Menu.Item>
                  </>
                )
              }

            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </li>
  );
}
