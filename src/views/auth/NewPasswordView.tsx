import NewPasswordToken from "@/components/auth/NewPasswordToken";
import NewPasswordForm from "@/components/auth/NewPasswordForm";
import { useState } from "react";
import type { ConfirmToken } from "@/types/index";

export default function NewPasswordView() {
    const [token, setToken] = useState<ConfirmToken["token"]>("")
    const [isValidToken, setIsValidToken] = useState(false)
  return (
    <>
      <div>
        <h1 className="md:text-5xl text-4xl text-center font-black text-white">
          Reestablecer Contraseña
        </h1>

        {!isValidToken ? (
          <p className="md:text-2xl text-xl font-normal text-center text-white mt-5">
            Ingresa el código que recibiste {""}
            <span className=" text-fuchsia-500 font-bold"> por email</span>
          </p>
        ) : (
          <p className="md:text-2xl text-xl font-normal text-center text-white mt-5">
            Ingresa la nueva {""}
            <span className=" text-fuchsia-500 font-bold"> contraseña</span>
          </p>
        )}
      </div>

      {!isValidToken ? (
        <NewPasswordToken
          token={token}
          setToken={setToken}
          setIsValidToken={setIsValidToken}
        />
      ) : (
        <NewPasswordForm token={token} />
      )}
    </>
  );
}
