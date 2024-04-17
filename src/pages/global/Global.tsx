import {Outlet, useMatch, useNavigate} from "react-router-dom";
import {useEffect} from "react";

import {useAppStore} from "@/store";
import {Toaster} from "@/components/ui/toaster"
import {ThemeProvider} from "@/components/theme-provider";
import {TailwindIndicator} from "@/components/tailwind-indicator";

export const Global = () => {
  const connected = useAppStore(state => state.connected)
  const navigate = useNavigate()

  const matchLogin = useMatch('/login')

  useEffect(() => {
    if (!connected && !matchLogin) {
      navigate('/login')
    }
    if (connected && matchLogin) {
      navigate('/')
    }
  }, [matchLogin, connected, navigate]);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="module-board-theme">
      <div className="flex flex-col w-screen h-screen">
        <Outlet/>
        <Toaster/>
        <TailwindIndicator/>
      </div>
    </ThemeProvider>
  )
}