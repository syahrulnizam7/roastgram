interface BackgroundPatternProps {
  darkMode: boolean;
}

export function BackgroundPattern({ darkMode }: BackgroundPatternProps) {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
      {/* Grid Pattern */}
      <div
        className={`absolute inset-0 ${darkMode ? "opacity-10" : "opacity-20"}`}
      >
        <div
          className="absolute top-0 left-0 right-0 bottom-0"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, ${
              darkMode ? "#ffffff" : "#000000"
            }, ${
              darkMode ? "#ffffff" : "#000000"
            } 1px, transparent 1px, transparent 80px),
                                repeating-linear-gradient(90deg, ${
                                  darkMode ? "#ffffff" : "#000000"
                                }, ${
              darkMode ? "#ffffff" : "#000000"
            } 1px, transparent 1px, transparent 80px)`,
            backgroundSize: "80px 80px",
          }}
        ></div>
      </div>

      {/* Diagonal Stripes */}
      <div
        className={`absolute inset-0 ${darkMode ? "opacity-5" : "opacity-10"}`}
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, ${
            darkMode ? "#ffffff" : "#000000"
          } 0, ${
            darkMode ? "#ffffff" : "#000000"
          } 1px, transparent 0, transparent 20px)`,
          backgroundSize: "30px 30px",
        }}
      ></div>

      {/* Random Shapes - Hide on mobile */}
      <div className="hidden md:block">
        {!darkMode && (
          <>
            <div className="absolute top-[10%] left-[5%] w-40 h-40 bg-[#00FFFF] opacity-20 rotate-12"></div>
            <div className="absolute bottom-[15%] right-[8%] w-60 h-60 bg-[#FF00FF] opacity-20 -rotate-12"></div>
            <div className="absolute top-[40%] right-[15%] w-32 h-32 bg-[#FFFF00] opacity-20 rotate-45"></div>
          </>
        )}

        {darkMode && (
          <>
            <div className="absolute top-[10%] left-[5%] w-40 h-40 bg-purple-500 opacity-10 rotate-12"></div>
            <div className="absolute bottom-[15%] right-[8%] w-60 h-60 bg-cyan-500 opacity-10 -rotate-12"></div>
            <div className="absolute top-[40%] right-[15%] w-32 h-32 bg-yellow-500 opacity-10 rotate-45"></div>
          </>
        )}
      </div>
    </div>
  );
}
