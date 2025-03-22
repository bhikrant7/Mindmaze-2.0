"use client";

import React from 'react';
import styled from 'styled-components';
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function GamePageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-full p-6">
      <div className="fixed top-20 right-20">
      <StyledWrapper>
      <Button className="comic-button bg-transparent hover:bg-gray-100 active:bg-gray-200 shadow-md hover:shadow-lg active:shadow-sm transition-shadow p-2 rounded-md">
      <Image draggable="false"className='-mt-4' src="/menu_white.png" alt="Menu" width={30} height={30} />
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
    background-color: transparent;
    border: 2px solid #ffffff;
    border-radius: 10px;
    box-shadow: 5px 5px 0px #ffffff;
    transition: all 0.3s ease;
    cursor: pointer;
  }

  .comic-button:hover {
    background-color: #ffffff;
    color: #ffffff;
    border: 2px solid #ffffff;
    box-shadow: 5px 5px 0px #ffffff;
  }

  .comic-button:active {
    background-color: #ffffff;
    box-shadow: none;
    transform: translateY(4px);
  }`;