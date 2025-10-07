import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { ForgotPasswordForm } from "../../types";
import ErrorMessage from "@/components/ErrorMessage";
import { forgotPassword } from "@/api/AuthAPI";
import { toast } from "react-toastify";

export default function ForgotPasswordView() {
  const initialValues: ForgotPasswordForm = {
    email: "",
  };
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });

  const {mutate} = useMutation({
    mutationFn: forgotPassword,
    onError: (error) => {
        toast.error(error.message)
    },
    onSuccess: (data) => {
        toast.success(data)
        reset()
    }
  })

  const handleForgotPassword = (formData: ForgotPasswordForm) => mutate(formData)

  return (
    <>
      <div>
        <h1 className="text-5xl font-black text-white">Reestablecer Contraseña</h1>
        <p className="text-2xl font-light text-white mt-5">
          ¿Olvidaste tu password? coloca tu email {""}
          <span className=" text-fuchsia-500 font-bold"> y reestablece tu password</span>
        </p>
      </div>

      <form
        onSubmit={handleSubmit(handleForgotPassword)}
        className="space-y-8 p-10  bg-white md:w-2/4 w-full rounded-lg"
        noValidate
      >
        <div className="flex flex-col gap-5">
          <label className="font-normal md:text-2xl text-xl" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Email de Registro"
            className="w-full p-3 border-gray-300 border"
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
          value="Enviar Instrucciones"
          className="bg-gray-800 hover:bg-gray-900 py-2 px-4 text-white text-lg font-bold cursor-pointer transition-colors duration-200 rounded-md flex items-center gap-4 justify-center w-full"
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
          ¿No tienes cuenta?
          <Link className="text-cyan-600" to={"/auth/register"}>
            Crear cuenta
          </Link>
        </p>
      </nav>
    </>
  );
}
