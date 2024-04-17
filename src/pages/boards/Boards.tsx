import {ColumnDef} from "@tanstack/react-table"
import {cn} from "@/lib/utils";
import {Link} from "react-router-dom";

import {BoardT} from "@/types";
import {useAppStore} from "@/store";
import {DataTable} from "@/components/data-table";
import {buttonVariants} from "@/components/ui/button";
import {Icons} from "@/components/icons";

const columns: ColumnDef<BoardT>[] = [
  {
    accessorKey: "slug",
    header: "Slug",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "height",
    header: "Height",
  },
  {
    accessorKey: "width",
    header: "Width",
  },
  {
    id: "action",
    header: "Action",
    cell: ({row: {original: event}}) => {
      return (
        <div className="flex gap-2 justify-end">
          <Link
            to={`/admin/board/${event.id}/layout`}
            className={cn(
              buttonVariants({variant: "ghost"}),
            )}
          >
            <>
              <Icons.create className="mr-2 h-4 w-4"/>
              Edit Layout
            </>
          </Link>
          <Link
            to={`/admin/board/${event.id}`}
            className={cn(
              buttonVariants({variant: "ghost"}),
            )}
          >
            <>
              <Icons.create className="mr-2 h-4 w-4"/>
              Edit
            </>
          </Link>
        </div>
      )
    }
  },
]


export const Boards = () => {
  const boards = useAppStore(state => state.boards)
  return (
    <div className="flex flex-col flex-1 gap-2">
      <div className="flex justify-end">
        <Link
          to="/admin/board/new"
          className={cn(buttonVariants())}
        >
          <>
            <Icons.create className="mr-2 h-4 w-4"/>
            Create
          </>
        </Link>
      </div>
      <div className="flex-1 rounded-md border overflow-auto" style={{height: 'calc(100vh - 200px)'}}>
        <DataTable
          getRowId={((originalRow) => originalRow.id ?? `${Math.random()}`)}
          columns={columns}
          data={boards}
        />
      </div>
    </div>
  )
}