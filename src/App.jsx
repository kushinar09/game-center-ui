"use client"

import { Suspense, lazy } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import LoadingScreen from "./components/pages/LoadingScreen"

const Line98Game = lazy(() => import("./components/pages/line98/line98"))
const CaroGame = lazy(() => import("./components/pages/caro/index"))
const Fib100 = lazy(() => import("./components/pages/fib100"))
const Menu = lazy(() => import("./components/index"))

function App() {
  return (
    <>
      <Router>
        <div className="mx-auto">
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              <Route path="/caro" element={<CaroGame />} />
              <Route path="/line98" element={<Line98Game />} />
              <Route path="/fib" element={<Fib100 />} />
              <Route path="/" element={<Menu />} />
            </Routes>
          </Suspense>
        </div>
      </Router>
    </>
  )

}

export default App
