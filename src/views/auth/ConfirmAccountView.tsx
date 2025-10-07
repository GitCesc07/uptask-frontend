import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { PinInput, PinInputField } from "@chakra-ui/pin-input";
import { useMutation } from "@tanstack/react-query";
import type { ConfirmToken } from "@/types/index";
import { confirmAccount } from "@/api/AuthAPI";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export default function ConfirmAccountView() {
  const navigate = useNavigate();
  const [token, setToken] = useState<ConfirmToken["token"]>("");
  const { mutate } = useMutation({
    mutationFn: confirmAccount,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      setToken("");
      MySwal.fire({
        title: "Login",
        html: `
                    <p class="text-lg text-gray-600 text-center">
                      ¿Deseas iniciar sesión?
                    </p>
                  `,
        icon: "question",
        showCancelButton: true,
        cancelButtonColor: "#d33",
        cancelButtonText: "No, iniciar sesión!",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Si, iniciar sesión!",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/auth/login");
        }
      });
    },
  });

  const handleChange = (token: ConfirmToken["token"]) => {
    setToken(token);
  };

  const handleComplete = (token: ConfirmToken["token"]) => {
    mutate({ token });
  };
  return (
    <>
      <div className="w-full md:w-3/5">
        <h1 className="md:text-5xl text-center text-3xl font-black text-white">
          Confirma tu Cuenta
        </h1>
        <p className="md:text-2xl text-xl text-center font-light text-white mt-5">
          Ingresa el código que recibiste {""}
          <span className=" text-fuchsia-500 font-bold"> por e-mail</span>
        </p>
      </div>
      <form className="space-y-8 p-10 bg-white mt-8 rounded-lg">
        <label className="font-normal text-2xl text-center block">
          Código de 6 dígitos
        </label>
        <div className="flex justify-center gap-4">
          <PinInput
            value={token}
            onChange={handleChange}
            onComplete={handleComplete}
          >
            <PinInputField className="w-8 h-10 text-center px-2 py-1 rounded-md border-gray-400 border placeholder-white" />
            <PinInputField className="w-8 h-10 text-center px-2 py-1 rounded-md border-gray-400 border placeholder-white" />
            <PinInputField className="w-8 h-10 text-center px-2 py-1 rounded-md border-gray-400 border placeholder-white" />
            <PinInputField className="w-8 h-10 text-center px-2 py-1 rounded-md border-gray-400 border placeholder-white" />
            <PinInputField className="w-8 h-10 text-center px-2 py-1 rounded-md border-gray-400 border placeholder-white" />
            <PinInputField className="w-8 h-10 text-center px-2 py-1 rounded-md border-gray-400 border placeholder-white" />
          </PinInput>
        </div>
      </form>

      <nav className="mt-10 flex flex-col space-y-4">
        <Link
          to="/auth/request-code"
          className="text-center text-cyan-600 font-normal"
        >
          Solicitar un nuevo Código
        </Link>
      </nav>
    </>
  );
}
