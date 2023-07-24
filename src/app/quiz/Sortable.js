import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function Sortable({ text, solutionClass, solutionStyle, answer, index, draggable }) {
   const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: text, disabled: draggable });
   const style = { transform: CSS.Transform.toString(transform) };

   return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="bar draggable">
         {text}
         <span style={solutionStyle} className={solutionClass}>
            {answer[index]?.solution}
            <span className="number" style={answer[index]?.score == 0 ? { backgroundColor: "#e44803" } : null}>
               {answer[index]?.rank}
            </span>
         </span>
      </div>
   );
}
