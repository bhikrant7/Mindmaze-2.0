import { useAuthStore } from "@/lib/store/authStore";
import { Button } from "./ui/button";
import toast from "react-hot-toast";
import React from "react";
import styled from "styled-components";

export default function SignOutButton() {
  const { signOut } = useAuthStore();
  const handleSignOut = async () => {
    await signOut().then(() => {
      console.log("Signed Out successfully");
      toast.success("Signed Out successfully", {
        duration: 10000,
        position: "top-center",
        style: {
          background: "rgba(19, 12, 28, 0.15)",
          border: "1px solid #00AB66",
          color: "#00AB66",
          padding: "12px 16px",
          borderRadius: "8px",
          backdropFilter: "blur(8px)",
        },
        iconTheme: {
          primary: "#00AB66",
          secondary: "#FFFFFF",
        },
      });
    });
  };
  return (
    <>
      <StyledWrapper>
        <Button variant="destructive" onClick={handleSignOut} className="Btn">
          <div className="sign">
            <svg viewBox="0 0 512 512">
              <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" />
            </svg>
          </div>
          <div className="text">Logout</div>
        </Button>
      </StyledWrapper>
    </>
  );
}
const StyledWrapper = styled.div`
  .Btn {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 65px;
    height: 65px;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition-duration: 0.3s;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.199);
    background-color: rgb(255, 65, 65);
  }

  /* plus sign */
  .sign {
    padding: 0px 10px;
    // width: 100%;
    transition-duration: 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .sign svg {
    width: 21px !important;
    height: 21px !important;
  }

  .sign svg path {
    fill: white;
  }
  /* text */
  .text {
    position: absolute;
    right: 0%;
    width: 0%;
    opacity: 0;
    color: white;
    font-size: 1.6em;
    font-weight: 600;
    transition-duration: 0.3s;
  }
  /* hover effect on button width */
  .Btn:hover {
    width: 155px;
    border-radius: 40px;
    transition-duration: 0.3s;
  }

  .Btn:hover .sign {
    width: 30%;
    transition-duration: 0.3s;
    padding-left: 10px;
    margin-top: 2px;
    padding-right: 20px; 
  }
  /* hover effect button's text */
  .Btn:hover .text {
    opacity: 1;
    width: 70%;
    transition-duration: 0.3s;
    padding-right: 10px;
  }
  /* button click effect*/
  .Btn:active {
    transform: translate(2px, 2px);
  }
`;
