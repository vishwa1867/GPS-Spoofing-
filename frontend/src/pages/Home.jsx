import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="radar-bg"></div>

      <div className="content">
        <h1 className="title">AUTONOMOUS DRONE</h1>
        <h2 className="subtitle">GPS SPOOFING ANALYSIS SYSTEM</h2>

        <p className="desc">
          Signal Acquisition • Navigation Planning • Spoofing Detection
        </p>

        <button
          className="launch-btn"
          onClick={() => navigate("/system")}
        >
          LAUNCH SYSTEM
        </button>
      </div>
    </div>
  );
};

export default Home;
