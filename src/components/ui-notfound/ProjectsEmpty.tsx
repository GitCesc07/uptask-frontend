import ImageEmpty from "../imageUI/ImageEmpty";

export default function ProjectsEmpty() {
  return (
    <div className="flex items-center flex-col justify-center">
      <ImageEmpty />
      <p className="text-center mt-4 text-xl">
        Aún no hay proyectos para mostrar...
      </p>
    </div>
  );
}
