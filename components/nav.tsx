"use client";

import { UserButton } from "@clerk/nextjs";

const NavBar = () => {
  return (
    <nav className="p-4 flex justify-between items-center">
      <div>
        <h1 className="font-bold">S3 Web UI</h1>
      </div>
      <div>
        <UserButton />
      </div>
    </nav>
  );
};

export default NavBar;
