import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { RequestConfirmationCodeForm } from "../../types";
import ErrorMessage from "@/components/ErrorMessage";
import { requestConfirmationCode } from "@/api/AuthAPI";
import { toast } from "react-toastify";

export default function RegisterView() {
  const initialValues: RequestConfirmationCodeForm = {
    email: "",
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });

  const { mutate } = useMutation({
    mutationFn: requestConfirmationCode,
    onError: (error) => {
        toast.error(error.message)
    },
    onSuccess: (data) => {
        toast.success(data)
        reset()
    }
  });

  const handleRequestCode = (formData: RequestConfirmationCodeForm) => mutate(formData)

  return (
    <>
      <h1 className="md:text-5xl text-3xl font-black text-white">
        Solicitar Código de Confirmación
      </h1>
      <p className="md:text-2xl text-xl font-light text-white mt-5">
        Coloca tu e-mail para recibir {""}
        <span className=" text-fuchsia-500 font-bold"> un nuevo código</span>
      </p>

      <form
        onSubmit={handleSubmit(handleRequestCode)}
        className="md:w-2/4 w-full space-y-8 md:p-10 p-4 rounded-lg bg-white mt-10"
        noValidate
      >
        <div className="flex flex-col gap-5">
          <label className="font-normal md:text-2xl text-lg" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Email de Registro"
            className="w-full p-3 rounded-lg border-gray-300 border"
            {...register("email", {
              required: "El Email de registro es obligatorio",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "E-mail no válido",
              },
            })}
          />
          {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
        </div>

        <input
          type="submit"
          value="Enviar Código"
          className="bg-gray-800 hover:bg-gray-900 py-2 px-4 text-white text-lg md:text-2xl font-bold cursor-pointer transition-colors duration-200 rounded-md flex items-center gap-4 justify-center w-full"
        />
      </form>

      <nav className="md:mt-8 mt-6 flex flex-col space-y-3">
        <p className="flex md:text-xl text-lg items-center gap-1 text-center text-gray-300 font-semibold">
          ¿Ya tienes cuenta?
          <Link className="text-cyan-600" to={"/auth/login"}>
            Iniciar sesión
          </Link>
        </p>

        <p className="flex md:text-xl text-lg items-center gap-1 text-center text-gray-300 font-semibold">
          ¿Olvidaste tu contraseña?
          <Link className="text-cyan-600" to={"/auth/forgot-password"}>
            Reestablecer
          </Link>
        </p>
      </nav>
    </>
  );
}
