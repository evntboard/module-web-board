import * as React from "react";
import {useForm} from "react-hook-form";
import {useNavigate} from "react-router-dom";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";

import {cn} from "@/lib/utils";
import {boardSchema} from "@/lib/validation/boardSchema";
import {Button} from "@/components/ui/button";
import {toast} from "@/components/ui/use-toast";
import {Icons} from "@/components/icons";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {BoardT} from "@/types";
import {useAppStore} from "@/store";
import {generateStringId} from "@/lib/generateStringId";
import {ColorPicker} from "@/components/ColorPicker.tsx";

type FormData = z.infer<typeof boardSchema>

type Props = {
  defaultValues: BoardT,
}

export const BoardForm = ({defaultValues}: Props) => {
  const navigate = useNavigate()
  const form = useForm<FormData>({
    resolver: zodResolver(boardSchema),
    defaultValues
  })
  const saveBoard = useAppStore(state => state.saveBoard)

  const [isSaving, setIsSaving] = React.useState<boolean>(false)

  async function onSubmit(data: FormData) {
    setIsSaving(true)
    try {
      await saveBoard({
        height: data.height,
        slug: data.slug,
        name: data.name,
        image: data.image,
        description: data.description,
        color: data.color,
        layout: defaultValues.layout,
        width: data.width,
        default: defaultValues.default,
        id: data.id ?? generateStringId(),
      })
      toast({
        description: "module sent",
      })

      navigate(`/admin/boards`)
    } catch (e) {
      toast({
        title: "Something went wrong.",
        description: "Your module was not created. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Form {...form}>
      <form
        className={cn('flex flex-col gap-2 px-1')}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="slug"
          render={({field}) => (
            <FormItem>
              <FormLabel>slug</FormLabel>
              <FormControl>
                <Input placeholder="My Board" {...field} />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage/>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({field}) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="My Board" {...field} />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage/>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({field}) => (
            <FormItem>
              <FormLabel>description</FormLabel>
              <FormControl>
                <Input placeholder="My Board" {...field} />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage/>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`height`}
          render={({field}) => (
            <FormItem>
              <FormLabel>Height</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="/constants"
                  {...field}
                  onChange={(e) => {
                    const number = parseInt(e.target.value, 10)
                    if (isNaN(number)) {
                      field.onChange(e.target.value)
                    } else {
                      field.onChange(number)
                    }
                  }}
                />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage/>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`width`}
          render={({field}) => (
            <FormItem>
              <FormLabel>Width</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="/constants"
                  {...field}
                  onChange={(e) => {
                    const number = parseInt(e.target.value, 10)
                    if (isNaN(number)) {
                      field.onChange(e.target.value)
                    } else {
                      field.onChange(number)
                    }
                  }}
                />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage/>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="color"
          render={({field}) => (
            <FormItem>
              <FormLabel>color</FormLabel>
              <FormControl>
                <ColorPicker
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage/>
            </FormItem>
          )}
        />
        <div>
          <Button
            type="submit"
            disabled={isSaving}
          >
            {isSaving && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin"/>
            )}
            Send
          </Button>
        </div>
      </form>
    </Form>
  )
}