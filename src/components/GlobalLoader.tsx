"use client";

import useLoadingStore from "../lib/store/loadingStore";
import { StyledWrapper } from "./StyledWrapper";

const GlobalLoader = () => {
  const isGlobalLoading = useLoadingStore((state) => state.isGlobalLoading);

  if (!isGlobalLoading) return null;

  return (
    <StyledWrapper>
      <div className="loadingspinner">
        <div id="square1" />
        <div id="square2" />
        <div id="square3" />
        <div id="square4" />
        <div id="square5" />
      </div>
    </StyledWrapper>
  );
};

export default GlobalLoader;
