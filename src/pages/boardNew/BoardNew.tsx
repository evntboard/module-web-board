import {Link} from "react-router-dom";

import {cn} from "@/lib/utils";
import {BoardForm} from "@/components/BoardForm";
import {Icons} from "@/components/icons";
import {buttonVariants} from "@/components/ui/button";
import {generateColor} from "@/lib/generateColor";

export const BoardNew = () => {
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
        defaultValues={{
          id: undefined,
          name: "A new board",
          slug: undefined,
          description: "",
          height: 5,
          layout: [],
          default: false,
          width: 5,
          color: generateColor(),
          image: undefined,
        }}
      />
    </div>
  )
}