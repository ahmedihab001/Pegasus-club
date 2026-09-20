import { useParams } from "react-router-dom";

export default function ProgramDetails(){
  const { id } = useParams();

  return(
    <div style={{padding:"20px"}}>
      <h2>Program Details</h2>

      <p>ID: {id}</p>
      <p>Coach: Ahmed</p>
      <p>Time: Monday 5 PM</p>
      <p>Location: Main Hall</p>
      <p>Duration: 2 hours</p>

      <button>Join Program</button>
    </div>
  )
}
