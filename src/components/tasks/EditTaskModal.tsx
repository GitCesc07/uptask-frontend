import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useNavigate, useParams } from "react-router-dom";
import type { Task, TaskFormData } from "@/types/index";
import { useForm } from "react-hook-form";
import TaskForm from "./TaskForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTask } from "@/api/TaskAPI";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

type EditTaskProps = {
    data: Task
    taskId: Task["_id"]
}

export default function EditTaskModal({data, taskId} : EditTaskProps) {
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const params = useParams()
    const projectId = params.projectId!

        const {
          register,
          handleSubmit,
          reset,
          formState: { errors },
        } = useForm<TaskFormData>({ defaultValues: {
            name: data.name,
            description: data.description
        } });

        const {mutate} = useMutation({
            mutationFn: updateTask,
            onError: (error) => {
                toast.error(error.message)
            },
            onSuccess: (data) => {
                queryClient.invalidateQueries({queryKey: ["project", projectId]})
                queryClient.invalidateQueries({queryKey: ["task", taskId]})
                toast.success(data)
                reset()
                navigate(location.pathname, {replace: true})
            }
        })

        const handleEditTask = (formData: TaskFormData) => {
            const data = { projectId, taskId, formData }

            MySwal.fire({
              title: "Modificar tarea",
              html: `
                    <p class="text-lg text-gray-600 text-center">
                      ¿Seguro deseas modificar la tarea <span class="font-bold text-gray-900">${formData.name}</span>?
                    </p>
                  `,
              icon: "question",
              showCancelButton: true,
              cancelButtonColor: "#d33",
              cancelButtonText: "No, modificar!",
              confirmButtonColor: "#3085d6",
              confirmButtonText: "Si, modificarla!",
            }).then((result) => {
              if (result.isConfirmed) {
                mutate(data);
              }
            });            
        }

  return (
    <Transition appear show={true} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => navigate(location.pathname, {replace: true})}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-4 md:p-8 lg:p-14">
                <Dialog.Title
                  as="h3"
                  className="font-black text-3xl md:text-4xl  my-5"
                >
                  Editar Tarea
                </Dialog.Title>

                <p className="text-xl font-bold">
                  Realiza cambios a una tarea en {""}
                  <span className="text-cyan-700">este formulario</span>
                </p>

                <form 
                    className="mt-10 space-y-3" 
                    noValidate
                    onSubmit={handleSubmit(handleEditTask)}
                >

                    <TaskForm
                        register={register}
                        errors={errors}
                    />

                  <input
                    type="submit"
                    className="bg-gray-800 hover:bg-gray-900 text-white w-full py-2 px-4 uppercase font-bold cursor-pointer transition-colors duration-200 rounded-md mt-8"
                    value="Modificar tarea"
                  />
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
