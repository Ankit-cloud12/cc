import React from "react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";

export function DenseMenubarExample() {
  return (
    <div className="p-4 bg-zinc-800 rounded-md">
      <h2 className="text-lg font-medium text-white mb-4">Dense Menubar Example</h2>
      <Menubar className="border-zinc-700 bg-zinc-800 h-8 space-x-0">
        <MenubarMenu>
          <MenubarTrigger className="text-white px-3 py-1 text-sm">Projects</MenubarTrigger>
          <MenubarContent className="bg-zinc-800 border-zinc-700">
            <MenubarItem className="text-gray-300 hover:text-white hover:bg-zinc-700 text-sm">All Projects</MenubarItem>
            <MenubarItem className="text-gray-300 hover:text-white hover:bg-zinc-700 text-sm">New Project</MenubarItem>
            <MenubarItem className="text-gray-300 hover:text-white hover:bg-zinc-700 text-sm">Archived Projects</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger className="text-white px-3 py-1 text-sm">Tasks</MenubarTrigger>
          <MenubarContent className="bg-zinc-800 border-zinc-700">
            <MenubarItem className="text-gray-300 hover:text-white hover:bg-zinc-700 text-sm">My Tasks</MenubarItem>
            <MenubarItem className="text-gray-300 hover:text-white hover:bg-zinc-700 text-sm">Assigned Tasks</MenubarItem>
            <MenubarItem className="text-gray-300 hover:text-white hover:bg-zinc-700 text-sm">Completed Tasks</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger className="text-white px-3 py-1 text-sm">Calendar</MenubarTrigger>
          <MenubarContent className="bg-zinc-800 border-zinc-700">
            <MenubarItem className="text-gray-300 hover:text-white hover:bg-zinc-700 text-sm">View Calendar</MenubarItem>
            <MenubarItem className="text-gray-300 hover:text-white hover:bg-zinc-700 text-sm">Schedule Task</MenubarItem>
            <MenubarItem className="text-gray-300 hover:text-white hover:bg-zinc-700 text-sm">Events</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger className="text-white px-3 py-1 text-sm">Settings</MenubarTrigger>
          <MenubarContent className="bg-zinc-800 border-zinc-700">
            <MenubarItem className="text-gray-300 hover:text-white hover:bg-zinc-700 text-sm">History</MenubarItem>
            <MenubarItem className="text-gray-300 hover:text-white hover:bg-zinc-700 text-sm">Time Tracking</MenubarItem>
            <MenubarSeparator className="bg-zinc-700" />
            <MenubarItem className="text-gray-300 hover:text-white hover:bg-zinc-700 text-sm">Start Timer</MenubarItem>
            <MenubarItem className="text-gray-300 hover:text-white hover:bg-zinc-700 text-sm">Time Logs</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  );
}

export default DenseMenubarExample;
