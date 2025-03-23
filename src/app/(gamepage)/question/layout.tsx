"use client";

import React from "react";
import styled from "styled-components";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import useNavigateWithLoader from "@/components/loaderUI/useNavigateWithLoader";

export default function GamePageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigate = useNavigateWithLoader();

  return (
    <div className="h-screen w-full p-6">
      <div className="fixed top-5 right-5 md:top-10 md:right-10">
        <StyledWrapper>
          <Button
            onClick={() => navigate("/mainpage")}
            className="comic-button bg-transparent hover:bg-gray-100 active:bg-gray-200 shadow-md hover:shadow-lg active:shadow-sm transition-shadow p-2 rounded-md"
          >
            <Image
              draggable="false"
              className="-mt-2 md:-mt-4 w-6 h-6 md:w-8 md:h-8"
              src="/menu_brown.png"
              alt="Menu"
              width={24}
              height={24}
            />
          </Button>
        </StyledWrapper>
      </div>
      {children}
    </div>
  );
}

const StyledWrapper = styled.div`
  .comic-button {
    display: inline-block;
    padding: 12px 8px;
    font-size: 18px;
    font-weight: bold;
    text-align: center;
    text-decoration: none;
    color: #fff;
    background-color: #ee7a00;
    border: 2px solid #19181d;
    border-radius: 10px;
    box-shadow: 3px 3px 0px #1e181a;
    transition: all 0.3s ease;
    cursor: pointer;

    @media (min-width: 768px) {
      /* Larger button styles for tablets and above */
      padding: 25px 12px;
      font-size: 24px;
      box-shadow: 5px 5px 0px #1e181a;
    }
  }

  .comic-button:hover {
    background-color: #aa5b06;
    border: 2px solid #16151a;
    box-shadow: 3px 3px 0px #121212;

    @media (min-width: 768px) {
      box-shadow: 5px 5px 0px #121212;
    }
  }

  .comic-button:active {
    transform: translateY(2px) translateX(2px);

    @media (min-width: 768px) {
      transform: translateY(4px) translateX(4px);
    }
  }

  .comic-button:disabled {
    background-color: #888;
    cursor: not-allowed;
    box-shadow: none;
    border: 2px solid #666;
  }
`;
