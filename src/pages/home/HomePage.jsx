import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-100">
      {/* VIDEO HERO SECTION */}
      <div className="">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="/video/polov.mp4"
          autoPlay
          loop
          muted
          playsInline
        />

        {/* Overlay */}
        <div className="absolute inset-0 flex items-end-safe justify-center pb-16">
          <div className="text-center text-white">
            <h1 className="text-4xl font-serif tracking-wide mb-2">
              RALPH LAUREN
            </h1>
            <p
              className="text-white/80 text-l uppercase tracking-widest cursor-pointer transition duration-300 hover:text-white hover:scale-105 hover:tracking-[0.2em]"
              onClick={() => navigate("/user")}
            >
              Click to start
            </p>
          </div>
        </div>
      </div>
      {/* MAIN CONTENT */}
    </div>
  );
};

export default HomePage;
