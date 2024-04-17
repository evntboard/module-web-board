import {Outlet} from "react-router-dom";

import {useAppStore} from "@/store";

export const Guard = () => {
  const connected = useAppStore(state => state.connected)

  if (connected) {
    return <Outlet/>
  }

  return null
}