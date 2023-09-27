import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useState } from 'react'

type CatResource = { catResource: string }

const getCatId = () => fetch("http://localhost:3030/cats")
  .then(resp => resp.json())
  .then(json => json as CatResource)

function App() {

  const [catImage, setCat] = useState<string>()

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => getCatId().then(cat => setCat("http://www.cataas.com" + cat.catResource))}>
          Click for a random cat
        </button>
        <p>{catImage}</p>
        <img src={catImage} />
      </div>
    </>
  )
}

export default App
