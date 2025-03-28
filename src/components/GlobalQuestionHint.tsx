"use client";

import { Button } from "@/components/ui/button";
import * as React from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const URL = "https://www.google.com/";

export function GlobalQuestionHint({ questionId, children }: { questionId: number; children: React.ReactNode }) {
  if (questionId !== 7) {
    return null; // Do not render if conditions aren't met
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Let&apos;s look into the hint</DrawerTitle>
          </DrawerHeader>
          <DrawerFooter>
            <Button
              className="cursor-pointer relative px-3 py-4 sm:px-4 sm:py-6 rounded-md text-white text-lg sm:text-2xl font-semibold shadow-md transition hover:scale-105 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-400 to-orange-600"
              onClick={() => window.open(URL, "_blank")}
            >
              Let&apos;s Go!
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
