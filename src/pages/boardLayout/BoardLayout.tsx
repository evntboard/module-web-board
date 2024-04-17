import {useEffect, useMemo, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";

import {Icons} from "@/components/icons";
import {Button, buttonVariants} from "@/components/ui/button";
import {Preview} from "@/components/preview/Preview";
import {useAppStore} from "@/store";
import {BoardT} from "@/types";
import {cn} from "@/lib/utils";
import {toast} from "@/components/ui/use-toast.ts";

export const BoardLayout = () => {
  const navigate = useNavigate()
  const {boardId} = useParams()
  const boards = useAppStore(state => state.boards)
  const [updatedBoard, setUpdatedBoard] = useState<BoardT>()
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const saveBoard = useAppStore(state => state.saveBoard)

  const currentBoard = useMemo(() => {
    return boards.find((d) => d.id === boardId)
  }, [boards, boardId])

  const handleSave = async () => {
    if (updatedBoard) {
      setIsSaving(true)
      try {
        await saveBoard(updatedBoard)
        navigate('/admin/boards')
      } catch (e) {
        if (e instanceof  Error) {
          toast({
            title: "Something went wrong.",
            description: e.message,
            variant: "destructive",
          })
        } else {
          toast({
            title: "Something went wrong.",
            description: "Unknown error ...",
            variant: "destructive",
          })
        }
      } finally {
        setIsSaving(false)
      }
    }
  }

  useEffect(() => {
    if (currentBoard) {
      setUpdatedBoard(currentBoard)
    }
  }, [currentBoard]);

  if (!currentBoard || !updatedBoard) {
    return null
  }

  return (
    <div className="flex flex-col flex-1 overflow-auto">
      <div className="flex justify-between">
        <Button onClick={handleSave} disabled={isSaving}>Save</Button>
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
      </div>
      <div className="flex flex-1">
        <Preview
          value={updatedBoard}
          onChange={setUpdatedBoard}
        />
      </div>
    </div>
  )
}