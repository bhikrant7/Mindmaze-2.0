import { useAuthStore } from "@/lib/store/authStore";
import { Button } from "./ui/button";
import toast from "react-hot-toast";

export default function SignOutButton() {
  const { signOut } = useAuthStore();
  const handleSignOut = async () => {
    await signOut().then(() => {
      console.log("Signed Out successfully");
      toast.success("Signed Out successfully", {
        duration: 10000,
        position: "top-center",
      });
    });
  };
  return (
    <>
      <Button
        variant={"destructive"}
        className="bg-orange-500 text-white text-2xl p-6"
        onClick={handleSignOut}
      >
        Signout
      </Button>
    </>
  );
}
