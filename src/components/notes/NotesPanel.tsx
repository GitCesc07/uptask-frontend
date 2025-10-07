import { Task } from "@/types/index";
import AddNoteForm from "./AddNoteForm";
import NotesDetails from "./NotesDetails";

type NotesPanelProps = {
    notes: Task["notes"]
}

export default function NotesPanel({ notes }: NotesPanelProps) {
    return (
        <>
            <AddNoteForm />

            <div className="divide-y divide-gray-100 mt-5">
                {
                    notes.length ?
                        (
                            <>
                                <p className="font-bold text-2xl text-slate-400 my-5">
                                    Notas:                            
                                </p>
                                {
                                    notes.map(note => (
                                        <NotesDetails key={note._id} note={note} />
                                    ))
                                }
                            </>
                        )
                            :
                        (
                            <p className="text-gray-500 text-center pt-2 font-bold">No hay notas...</p>
                        )                    
                }
        </div >
        </>
    )
}