

export default function ErrorMessage({children} : {children: React.ReactNode}) {
  return (
    <div className="text-center my-2 bg-red-200 text-red-600 font-bold py-2 px-4 uppercase text-sm rounded-lg">
        {children}
    </div>
  )
}
