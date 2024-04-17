import { Link } from 'react-router-dom'

import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Icons } from '@/components/icons'

export const Entrypoint = () => {
  return (
    <div className="flex flex-col container justify-center items-center gap-6">
      <div className="flex flex-col justify-center items-center gap-6">
        <div className="flex items-center gap-2">
          <Icons.logo />
          <h1 className="text-2xl">
            Module Board
          </h1>
        </div>
        <h3 className="text-xl">
          Choose your mode
        </h3>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <Link
          to="/admin"
          className={cn(
            'flex gap-2',
            buttonVariants({ variant: 'default' }),
          )}
        >
          Manage
        </Link>
        <Link
          to="/standalone"
          className={cn(
            'flex gap-2',
            buttonVariants({ variant: 'default' }),
          )}
        >
          Standalone
        </Link>
      </div>
    </div>
  )
}