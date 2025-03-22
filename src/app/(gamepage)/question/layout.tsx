"use client";

import React, { useState } from "react";
import styled from "styled-components";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function GamePageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const navigateAndRefresh = () => {
    if (isLoading) return;

    setIsLoading(true);
    router.push("/mainpage");

    setTimeout(() => {
      window.location.reload();
    }, 500); // min 500ms need to make sure the page transition before refresh
  };

  return (
    <div className="h-screen w-full p-6">
      <div className="fixed top-20 right-20">
        <StyledWrapper>
          <Button
            onClick={navigateAndRefresh}
            disabled={isLoading} // Disable button when loading
            className="comic-button bg-transparent hover:bg-gray-100 active:bg-gray-200 shadow-md hover:shadow-lg active:shadow-sm transition-shadow p-2 rounded-md"
          >
            {isLoading ? <Image
                draggable="false"
                className="-mt-4"
                src="/menu_brown.png"
                alt="Menu"
                width={30}
                height={30}
              /> : (
              <Image
                draggable="false"
                className="-mt-4"
                src="/menu_brown.png"
                alt="Menu"
                width={30}
                height={30}
              />
            )}
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
    padding: 25px 12px;
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    text-decoration: none;
    color: #fff;
    background-color: #ee7a00;
    border: 2px solid #19181d;
    border-radius: 10px;
    box-shadow: 5px 5px 0px #1e181a;
    transition: all 0.3s ease;
    cursor: pointer;
  }

  .comic-button:hover {
    background-color: #aa5b06;
    color: #ffffff;
    border: 2px solid #16151a;
    box-shadow: 5px 5px 0px #121212;
  }

  .comic-button:active {
    background-color: #aa5b06;
    box-shadow: none;
    transform: translateY(4px) translateX(4px);
  }

  .comic-button:disabled {
    background-color: #888;
    cursor: not-allowed;
    box-shadow: none;
    border: 2px solid #666;
  }
`;
