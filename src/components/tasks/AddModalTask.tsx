import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {useForm} from "react-hook-form"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import TaskForm from "./TaskForm";
import type { TaskFormData } from "@/types/index";
import { createTask } from "@/api/TaskAPI";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export default function AddTaskModal() {
    const navigate = useNavigate()

    //* Leer si el modal existe
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const modalTask = queryParams.get("newTask")
    const show = modalTask ? true : false

    //* Obtener projectId
    const params = useParams()
    const projectId = params.projectId!

    const initialValues : TaskFormData = {
        name: "",
        description: ""
    }

    const {register, handleSubmit, reset, formState: {errors}} = useForm<TaskFormData>({defaultValues: initialValues})

    const queryClient = useQueryClient()

    const {mutate} = useMutation({
        mutationFn: createTask,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
          queryClient.invalidateQueries({queryKey: ["project", projectId]})
            toast.success(data)
            reset()
            navigate(location.pathname, { replace: true })            
        }
    })

    const handleCreateTask = (formData : TaskFormData) => {
        const data = {
          formData,
          projectId
        }

        MySwal.fire({
          title: "Guardar Tarea",
          html: `
                    <p class="text-lg text-gray-600 text-center">
                      ¿Seguro deseas guardar la tarea?
                    </p>
                  `,
          icon: "question",
          showCancelButton: true,
          cancelButtonColor: "#d33",
          cancelButtonText: "No, guardar!",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Si, guardar!",
        }).then((result) => {
          if (result.isConfirmed) {
              mutate(data)            
          }
        }); 

    }
    
  return (    
      <Transition appear show={show} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => navigate(location.pathname, { replace: true })}
        >
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
                  <Dialog.Title as="h3" className="font-black text-3xl md:text-4xl  my-5">
                    Nueva Tarea
                  </Dialog.Title>

                  <p className="text-xl font-bold">
                    Llena el formulario y crea {""}
                    <span className="text-cyan-700">una tarea</span>
                  </p>

                  <form
                    className="mt-10 space-y-3"
                    noValidate
                    onSubmit={handleSubmit(handleCreateTask)}
                  >
                    <TaskForm 
                        register={register}
                        errors={errors}                                          
                    />

                    <input
                      type="submit"
                      className="bg-gray-800 hover:bg-gray-900 text-white w-full py-2 px-4 uppercase font-bold cursor-pointer transition-colors duration-200 rounded-md mt-8"
                      value="Guardar tarea"
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
