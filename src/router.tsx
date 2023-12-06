import {createHashRouter} from "react-router-dom";

import {App} from "@/pages/main/App";
import {Login} from "@/pages/login/login";
import {Guard} from "@/pages/guard/Guard";
import {Layout} from "@/pages/layout/Layout";
import {Global} from "@/pages/global/Global";
import {Boards} from "@/pages/boards/Boards";
import { Board } from "@/pages/board/Board";
import {BoardLayout} from "@/pages/boardLayout/BoardLayout";
import {BoardNew} from "@/pages/boardNew/BoardNew.tsx";

export const router = createHashRouter([
  {
    path: "/",
    element: <Global/>,
    children: [
      {
        path: "login",
        element: <Login/>,
      },
      {
        path: "/",
        element: <Guard/>,
        children: [

          {
            path: "standalone",
            element: <div>Stand alone</div>,
          },
          {
            path: "/",
            element: <Layout/>,
            children: [
              {
                path: "/",
                element: <App/>,
              },
              {
                path: "/boards",
                element: <Boards/>,
              },
              {
                path: "/board/new",
                element: <BoardNew/>,
              },
              {
                path: "/board/:boardId",
                element: <Board/>,
              },
              {
                path: "/board/:boardId/layout",
                element: <BoardLayout/>,
              }
            ]
          }
        ]
      },
    ]
  },
]);