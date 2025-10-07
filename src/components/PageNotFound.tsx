import { Link } from "react-router-dom";  

export default function PageNotFound() {
  return (
    <div className="flex items-center lg:flex-row flex-col-reverse justify-center mx-auto md:gap-10 gap-4">
      <div className="">
        <h2 className="text-3xl font-bold text-gray-900">
          No se encontraron resultados...
        </h2>
        <p className="text-lg text-gray-500 mb-4">
          No pudimos encontrar lo que buscaste. intenta buscar de nuevo.
        </p>
        <Link
          to="/"
          className="bg-gray-800 flex font-bold items-center justify-center lg:gap-4 gap-8 w-full lg:w-[70%] text-white rounded-lg hover:bg-gray-900 py-2 px-4 text-lg lg:text-xl"
        >
          Regresar a inicio
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="fill-white size-6"
          >
            <path
              d="M6 19h3v-5q0-.425.288-.712T10 13h4q.425 0 .713.288T15 14v5h3v-9l-6-4.5L6 10zm-2 0v-9q0-.475.213-.9t.587-.7l6-4.5q.525-.4 1.2-.4t1.2.4l6 4.5q.375.275.588.7T20 10v9q0 .825-.588 1.413T18 21h-4q-.425 0-.712-.288T13 20v-5h-2v5q0 .425-.288.713T10 21H6q-.825 0-1.412-.587T4 19m8-6.75"
            ></path>
          </svg>
        </Link>
      </div>
      <img
        className="md:size-96 size-80 drop-shadow-xl"
        src="/img-notfound.svg"
        alt="Image not found"
      />
    </div>
  );
}
