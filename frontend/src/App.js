import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import LiveMap from "./components/LiveMap";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/system" element={<LiveMap />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
