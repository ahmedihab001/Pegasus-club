{coaches.map(c=>(
  <div className="card">

    <h2>{c.name}</h2>
    <p>{c.sport}</p>

    <div>
      {c.slots.map(s=>(
        <button
          disabled={!s.available}
          onClick={()=>join(c.name,s.time,c.sport)}
        >
          {s.time}
        </button>
      ))}
    </div>

  </div>
))}
