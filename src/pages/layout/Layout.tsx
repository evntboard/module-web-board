import {Link, Outlet} from "react-router-dom";

import {ModeToggle} from "@/components/mode-toggle";
import {Icons} from "@/components/icons";

export const Layout = () => {
  return (
    <>
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex gap-6 md:gap-10">
            <Link to="/" className="flex items-center space-x-2">
              <Icons.logo className="h-6 w-6"/>
              <span className="inline-block font-bold">Module Board</span>
            </Link>
            <nav className="flex gap-6">
              <Link
                to='/admin'
                className="flex items-center text-sm font-medium text-muted-foreground"
              >
                Boards
              </Link>
              <Link
                to='/admin/boards'
                className="flex items-center text-sm font-medium text-muted-foreground"
              >
                Edit
              </Link>
            </nav>
          </div>
          <div className="flex gap-4">
            <ModeToggle/>
          </div>
        </div>
      </header>
      <div className="container flex-1 gap-4 flex flex-col md:flex-row my-6">
        <Outlet/>
      </div>
    </>
  )
}