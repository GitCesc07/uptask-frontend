import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import ProjectForm from "@/components/projects/ProjectForm";
import { ProjectFormData } from "@/types/index";
import { createProject } from "@/api/ProjectAPI";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export default function CreateProjectView() {
  const navigate = useNavigate();
  const initialValue: ProjectFormData = {
    projectName: "",
    clientName: "",
    description: "",
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: initialValue });

  const { mutate } = useMutation({
    mutationFn: createProject,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      navigate("/");
    },
  });

  const handleForm = (formData: ProjectFormData) => {
    MySwal.fire({
      title: "Guardar proyecto",
      html: `
                    <p class="text-lg text-gray-600 text-center">
                      ¿Seguro deseas guardar el proyecto?
                    </p>
                  `,
      icon: "question",
      showCancelButton: true,
      cancelButtonColor: "#d33",
      cancelButtonText: "No, guardar!",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Si, guardarlo!",
    }).then((result) => {
      if (result.isConfirmed) {
        mutate(formData);
      }
    });
  };

  const token = localStorage.getItem("authTokenUpTask") || null;

  return (
    <>
      {token ? (
        <>
          <div className="flex items-start justify-center flex-col max-w-2xl mx-auto">
            <h1 className="text-4xl font-black">Crear proyecto</h1>
            <p className="md:text-xl text-lg font-light text-gray-500 mb-4">
              Llena el siguiente formulario para crear un proyecto
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
                value="Crear proyecto"
                className="bg-gray-800 hover:bg-gray-900 py-2 px-4 text-white text-lg font-bold cursor-pointer transition-colors duration-200 rounded-md flex items-center gap-4 justify-center w-full"
              />
            </form>
          </div>
        </>
      ) : (
        <div className="h-full flex flex-col items-center justify-center gap-8">
          <img
            className="drop-shadow-lg w-80"
            src="https://i.ibb.co/ZWXMPNj/sign-in.webp"
            alt="Iniciar Sesión"
          />
          <p className="md:text-xl text-lg text-gray-800">Debes de iniciar sesión para crear tus proyectos...</p>

          <Link
            className="bg-gray-800 hover:bg-gray-900 py-2 px-4 text-white text-lg font-bold cursor-pointer transition-colors duration-200 rounded-md flex items-center gap-4 justify-center w-full md:w-auto"
            to="/auth/login"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 14 14"
              className="size-5 stroke-white"
            >
              <g
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="6.44" cy="11.33" r="2.17"></circle>
                <path d="m8 9.8l3.86-3.86a.36.36 0 0 1 .51 0l1.13 1.15m-3.05.28l1.02 1.02M2 12.5h-.5a1 1 0 0 1-1-1v-10a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1V4m-13-.5h13"></path>
              </g>
            </svg>
            Ir a Login
          </Link>
        </div>
      )}
    </>
  );
}
