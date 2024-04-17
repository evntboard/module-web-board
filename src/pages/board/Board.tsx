import {useMemo} from "react";
import {Link, useParams} from "react-router-dom";

import {cn} from "@/lib/utils";
import {BoardForm} from "@/components/BoardForm";
import {Icons} from "@/components/icons";
import {buttonVariants} from "@/components/ui/button";

import {useAppStore} from "@/store";

export const Board = () => {
  const {boardId} = useParams()
  const boards = useAppStore(state => state.boards)

  const currentBoard = useMemo(() => {
    return boards.find((d) => d.id === boardId)
  }, [boards, boardId])

  if (!currentBoard) {
    return null
  }

  return (
    <div className="flex-1 overflow-auto">
      <Link
        to="/admin/boards"
        className={cn(
          buttonVariants({variant: "ghost"}),
          "mb-4"
        )}
      >
        <>
          <Icons.chevronLeft className="mr-2 h-4 w-4"/>
          Back
        </>
      </Link>
      <BoardForm
        defaultValues={currentBoard}
      />
    </div>
  )
}