import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'

function App() {
  const [players, setPlayers] = useState([])

  useEffect(() => {
    fetch('/api/players')
      .then(res => res.json())
      .then(data => setPlayers(data))
      .catch(err => console.error('Failed to fetch players:', err))
  }, [])

  return (
    <div>
      <h2>Hello from React inside Razor!</h2>
      <h3>Players from API:</h3>
      <ul>
        {players.map((p, i) => <li key={i}>{p.name}</li>)}
      </ul>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('react-root')).render(<App />)
