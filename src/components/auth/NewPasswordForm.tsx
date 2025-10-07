import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import ErrorMessage from "@/components/ErrorMessage";
import { updatePasswordWithToken } from "@/api/AuthAPI";
import type { ConfirmToken, NewPasswordForm } from "../../types";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);


type NewPasswordFormProps = {
  token: ConfirmToken["token"]
};

export default function NewPasswordForm({ token }: NewPasswordFormProps) {
  const navigate = useNavigate();

  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarPasswordConfirm, setMostrarPasswordConfirm] = useState(false);

  const initialValues: NewPasswordForm = {
    password: "",
    password_confirmation: "",
  };
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });

  const { mutate } = useMutation({
    mutationFn: updatePasswordWithToken,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      reset();
      navigate("/auth/login")
    },
  });

  const handleNewPassword = (formData: NewPasswordForm) => {
    const data = {
      formData,
      token
    };

    MySwal.fire({
      title: "Reestablecer contraseña",
      html: `
                    <p class="text-lg text-gray-600 text-center">
                      ¿Seguro deseas reestablecer la contraseña?
                    </p>
                  `,
      icon: "question",
      showCancelButton: true,
      cancelButtonColor: "#d33",
      cancelButtonText: "No, reestablecer!",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Si, reestablecer!",
    }).then((result) => {
      if (result.isConfirmed) {        
        mutate(data)
      }
    }); 

  };

  const password = watch("password");

  return (
    <>
      <form
        onSubmit={handleSubmit(handleNewPassword)}
        className="space-y-8 md:p-10 p-5 w-full md:w-[450px] bg-white rounded-lg shadow-md shadow-slate-400"
        noValidate
      >
        <div className="flex flex-col gap-5">
          <label className="md:text-2xl text-xl" htmlFor="password">Password</label>

          <div className="flex items-center justify-between w-full p-3 border rounded-md outline-none active:border-blue-400 border-gray-400">
            <input
              type={`${mostrarPassword ? "text" : "password"}`}
              id="password"
              placeholder="Password de Registro"
              className="w-full outline-none border-none"
              {...register("password", {
                required: "El Password es obligatorio",
                minLength: {
                  value: 8,
                  message: "El Password debe ser mínimo de 8 caracteres",
                },
              })}
            />

            <button
              type="button"
              className=""
              onClick={() => setMostrarPassword(!mostrarPassword)}
            >
              {mostrarPassword ? (
                <svg
                  className="size-5"
                  data-testid="geist-icon"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M4.02168 4.76932C6.11619 2.33698 9.88374 2.33698 11.9783 4.76932L14.7602 7.99999L11.9783 11.2307C9.88374 13.663 6.1162 13.663 4.02168 11.2307L1.23971 7.99999L4.02168 4.76932ZM13.1149 3.79054C10.422 0.663244 5.57797 0.663247 2.88503 3.79054L-0.318359 7.5106V8.48938L2.88503 12.2094C5.57797 15.3367 10.422 15.3367 13.1149 12.2094L16.3183 8.48938V7.5106L13.1149 3.79054ZM6.49997 7.99999C6.49997 7.17157 7.17154 6.49999 7.99997 6.49999C8.82839 6.49999 9.49997 7.17157 9.49997 7.99999C9.49997 8.82842 8.82839 9.49999 7.99997 9.49999C7.17154 9.49999 6.49997 8.82842 6.49997 7.99999ZM7.99997 4.99999C6.34311 4.99999 4.99997 6.34314 4.99997 7.99999C4.99997 9.65685 6.34311 11 7.99997 11C9.65682 11 11 9.65685 11 7.99999C11 6.34314 9.65682 4.99999 7.99997 4.99999Z"
                    fill="currentColor"
                  ></path>
                </svg>
              ) : (
                <svg
                  className="size-5"
                  data-testid="geist-icon"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M0.191137 2.06228L0.751694 2.56055L14.2517 14.5605L14.8122 15.0588L15.8088 13.9377L15.2482 13.4394L13.4399 11.832L16.3183 8.48938V7.51059L13.1149 3.79053C10.6442 0.921301 6.36413 0.684726 3.59378 3.07992L1.74824 1.43943L1.18768 0.941162L0.191137 2.06228ZM14.7602 7.99998L12.3187 10.8354L10.6699 9.36978C11.249 8.24171 11.0661 6.82347 10.1213 5.87865C9.08954 4.8469 7.49326 4.72376 6.32676 5.50923L4.72751 4.08767C6.88288 2.36327 10.1023 2.59076 11.9783 4.76931L14.7602 7.99998ZM7.52702 6.57613L9.46929 8.30259C9.56713 7.82531 9.43091 7.30959 9.06063 6.93931C8.64578 6.52446 8.0484 6.4034 7.52702 6.57613ZM-0.318359 7.51059L1.40386 5.5106L2.54051 6.48938L1.23971 7.99998L4.02168 11.2307C5.52853 12.9805 7.90301 13.4734 9.89972 12.7017L10.4405 14.1008C7.88008 15.0904 4.82516 14.4625 2.88503 12.2094L-0.318359 8.48938V7.51059Z"
                    fill="currentColor"
                  ></path>
                </svg>
              )}
            </button>
          </div>
          {errors.password && (
            <ErrorMessage>{errors.password.message}</ErrorMessage>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <label
            htmlFor="password_confirmation"
            className="md:text-2xl text-xl"
          >
            Repetir Password
          </label>
          <div className="flex items-center justify-between w-full p-3 border rounded-md outline-none active:border-blue-400 border-gray-400">
            <input
              type={`${mostrarPasswordConfirm ? "text" : "password"}`}
              id="password_confirmation"
              placeholder="Repite Password de Registro"
              className="w-full outline-none border-none"
              {...register("password_confirmation", {
                required: "Repetir Password es obligatorio",
                validate: (value) =>
                  value === password || "Los Passwords no son iguales",
              })}
            />

            <button
              type="button"
              className=""
              onClick={() => setMostrarPasswordConfirm(!mostrarPasswordConfirm)}
            >
              {mostrarPasswordConfirm ? (
                <svg
                  className="size-5"
                  data-testid="geist-icon"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M4.02168 4.76932C6.11619 2.33698 9.88374 2.33698 11.9783 4.76932L14.7602 7.99999L11.9783 11.2307C9.88374 13.663 6.1162 13.663 4.02168 11.2307L1.23971 7.99999L4.02168 4.76932ZM13.1149 3.79054C10.422 0.663244 5.57797 0.663247 2.88503 3.79054L-0.318359 7.5106V8.48938L2.88503 12.2094C5.57797 15.3367 10.422 15.3367 13.1149 12.2094L16.3183 8.48938V7.5106L13.1149 3.79054ZM6.49997 7.99999C6.49997 7.17157 7.17154 6.49999 7.99997 6.49999C8.82839 6.49999 9.49997 7.17157 9.49997 7.99999C9.49997 8.82842 8.82839 9.49999 7.99997 9.49999C7.17154 9.49999 6.49997 8.82842 6.49997 7.99999ZM7.99997 4.99999C6.34311 4.99999 4.99997 6.34314 4.99997 7.99999C4.99997 9.65685 6.34311 11 7.99997 11C9.65682 11 11 9.65685 11 7.99999C11 6.34314 9.65682 4.99999 7.99997 4.99999Z"
                    fill="currentColor"
                  ></path>
                </svg>
              ) : (
                <svg
                  className="size-5"
                  data-testid="geist-icon"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M0.191137 2.06228L0.751694 2.56055L14.2517 14.5605L14.8122 15.0588L15.8088 13.9377L15.2482 13.4394L13.4399 11.832L16.3183 8.48938V7.51059L13.1149 3.79053C10.6442 0.921301 6.36413 0.684726 3.59378 3.07992L1.74824 1.43943L1.18768 0.941162L0.191137 2.06228ZM14.7602 7.99998L12.3187 10.8354L10.6699 9.36978C11.249 8.24171 11.0661 6.82347 10.1213 5.87865C9.08954 4.8469 7.49326 4.72376 6.32676 5.50923L4.72751 4.08767C6.88288 2.36327 10.1023 2.59076 11.9783 4.76931L14.7602 7.99998ZM7.52702 6.57613L9.46929 8.30259C9.56713 7.82531 9.43091 7.30959 9.06063 6.93931C8.64578 6.52446 8.0484 6.4034 7.52702 6.57613ZM-0.318359 7.51059L1.40386 5.5106L2.54051 6.48938L1.23971 7.99998L4.02168 11.2307C5.52853 12.9805 7.90301 13.4734 9.89972 12.7017L10.4405 14.1008C7.88008 15.0904 4.82516 14.4625 2.88503 12.2094L-0.318359 8.48938V7.51059Z"
                    fill="currentColor"
                  ></path>
                </svg>
              )}
            </button>
          </div>

          {errors.password_confirmation && (
            <ErrorMessage>{errors.password_confirmation.message}</ErrorMessage>
          )}
        </div>

        <input
          type="submit"
          value="Cambiar contraseña"
          className="bg-gray-800 hover:bg-gray-900 py-2 px-4 text-white text-lg font-bold cursor-pointer transition-colors duration-200 rounded-md flex items-center gap-4 justify-center w-full"
        />
      </form>

      <nav className="mt-10 md:text-2xl text-xl flex flex-col space-y-4">
        <Link
          to="/auth/login"
          className="text-center text-cyan-600 font-normal"
        >
          Regresar a login
        </Link>
      </nav>
    </>
  );
}
