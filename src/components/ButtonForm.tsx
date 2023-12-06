import * as React from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";

import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {toast} from "@/components/ui/use-toast";
import {Icons} from "@/components/icons";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select"
import {Input} from "@/components/ui/input";
import {ButtonT} from "@/types";
import {buttonSchema} from "@/lib/validation/buttonSchema";
import {ColorPicker} from "@/components/ColorPicker.tsx";

type FormData = z.infer<typeof buttonSchema>

type Props = {
  defaultValues: ButtonT,
  onSubmit: (d: FormData) => void,
}

export const ButtonForm = ({defaultValues, onSubmit: externalOnSubmit}: Props) => {
  const form = useForm<FormData>({
    resolver: zodResolver(buttonSchema),
    defaultValues
  })

  const [isSaving, setIsSaving] = React.useState<boolean>(false)

  async function onSubmit(data: FormData) {
    setIsSaving(true)
    try {
      externalOnSubmit?.(data)
      toast({
        description: "module sent",
      })
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
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input placeholder="my-text-1" {...field} />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage/>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='type'
          render={({field}) => (
            <FormItem className="flex-1">
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a type"/>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="button">Button</SelectItem>
                  <SelectItem value="switch">Switch</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription></FormDescription>
              <FormMessage/>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="text"
          render={({field}) => (
            <FormItem>
              <FormLabel>Text</FormLabel>
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
        <FormField
          control={form.control}
          name="image"
          render={({field}) => (
            <FormItem>
              <FormLabel>image</FormLabel>
              <FormControl>
                <Input placeholder="My Board" {...field} />
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