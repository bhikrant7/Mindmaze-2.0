import React from "react";

const Guide = () => {
  return (
    <>
      <div className="flex md:items-center justify-start p-4 text-white flex-col gap-2 md:flex-row border-b border-zinc-700/30">
        <span className="inline text-lg font-semibold tracking-wide">
          Guide:
        </span>
      </div>

      <div className="p-4 border-b border-zinc-700/30">
        <div className="flex items-center gap-3">
          <span className="text-sm text-zinc-300 font-medium">1</span>
          <span className="text-sm text-zinc-300 font-medium">
            Introduction
          </span>
        </div>
      </div>
    </>
  );
};

export default Guide;
