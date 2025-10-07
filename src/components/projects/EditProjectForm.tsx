import { Link, useNavigate } from "react-router-dom";
import ProjectForm from "./ProjectForm";
import { ProjectFormData, Project } from "@/types/index";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateProject } from "@/api/ProjectAPI";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

type EditProjectFormProps = {
  data: ProjectFormData,
  projectId: Project["_id"]
}

export default function EditProjectForm({ data, projectId }: EditProjectFormProps) {

  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      projectName: data.projectName,
      clientName: data.clientName,
      description: data.description,
    },
  });

  const queryClient = useQueryClient()
  const { mutate } = useMutation({
    mutationFn: updateProject,
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] })
      queryClient.invalidateQueries({ queryKey: ["editProject", projectId] });

      toast.success(data)
      navigate("/")
    }
  })

  const handleForm = (formData: ProjectFormData) => {
    const data = {
      formData,
      projectId
    }

    MySwal.fire({
      title: "Modificar proyecto",
      html: `
                    <p class="text-lg text-gray-600 text-center">
                      ¿Seguro deseas modificar el proyecto <span class="font-bold text-gray-900">${formData.projectName}</span>?
                    </p>
                  `,
      icon: "question",
      showCancelButton: true,
      cancelButtonColor: "#d33",
      cancelButtonText: "No, modificar!",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Si, modificarlo!",
    }).then((result) => {
      if (result.isConfirmed) {
        mutate(data)
      }
    });
  };

  return (
    <>
      <div className="flex items-start justify-center flex-col max-w-2xl mx-auto">
        <h1 className="text-4xl font-black">Editar proyecto</h1>
        <p className="md:text-xl text-lg font-light text-gray-500 mb-4">
          Llena el siguiente formulario para editar un proyecto
        </p>
        <div className="md:w-[34%] w-full">
          <Link
            className="bg-gray-800 hover:bg-gray-900 py-2 px-4 text-white text-lg font-bold cursor-pointer transition-colors duration-200 rounded-md flex items-center gap-4 justify-center w-full"
            to="/"
          >
            Volver a proyectos
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="fill-white size-6"
            >
              <path d="m9 18l-6-6l6-6l1.4 1.4L6.8 11H19V7h2v6H6.8l3.6 3.6z"></path>
            </svg>
          </Link>
        </div>
      </div>
      <div className="max-w-2xl mx-auto">
        <form
          action=""
          className="mt-10 bg-white shadow-lg shadow-slate-400/70 md:p-10 p-4 rounded-lg"
          onSubmit={handleSubmit(handleForm)}
          noValidate
        >
          <ProjectForm register={register} errors={errors} />

          <input
            type="submit"
            value="Modificar proyecto"
            className="bg-gray-800 hover:bg-gray-900 text-white w-full py-2 px-4 uppercase font-bold cursor-pointer transition-colors duration-200 rounded-md"
          />
        </form>
      </div>
    </>
  );
}
