import {SubmitHandler, useForm} from "react-hook-form"
import * as z from "zod";
import {useState} from "react";

import {cn} from "@/lib/utils";
import {Icons} from "@/components/icons"
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {useToast} from "@/components/ui/use-toast";
import {useAppStore} from "@/store.ts";
import {ModeToggle} from "@/components/mode-toggle.tsx";

const eventSchema = z.object({
  name: z.string(),
  token: z.string(),
  host: z.string(),
})

type FormData = z.infer<typeof eventSchema>

export const Login = () => {
  const {toast} = useToast()
  const form = useForm<FormData>(
    {
      defaultValues: {
        host: import.meta.env.PROD ? "wss://module.evntboard.io" : import.meta.env.VITE_EVNTBOARD_HOST ?? "wss://module.evntboard.io",
        name: import.meta.env.PROD ? "board" : import.meta.env.VITE_MODULE_CODE ?? "",
        token: import.meta.env.PROD ? "" : import.meta.env.VITE_MODULE_TOKEN ?? "",
      }
    }
  )
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [showHost, setShowHost] = useState<boolean>(false)

  const startListening = useAppStore(state => state.startListening)

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsSaving(true)
    try {
      await startListening({
        host: data.host,
        token: data.token,
        name: data.name,
      })
    } catch (e) {
      if (e instanceof Error) {
        toast({
          title: "Something went wrong.",
          description: e.message,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Something went wrong.",
          description: "Your module was not created. Pro plan is required.",
          variant: "destructive",
        })
      }
    } finally {
      setIsSaving(false)
    }
  }

  const handleChangeHost = () => {
    setShowHost((h) => !h)
  }

  return (
    <>
      <div className="absolute right-2 top-2">
        <ModeToggle/>
      </div>
      <div className="flex flex-col items-center mx-auto w-[400px]">
        <div className="flex items-center gap-2">
          <Icons.logo/>
          <h1 className="text-2xl">
            Module Board
          </h1>
        </div>
        <Form {...form}>
          <form
            className={cn('flex-1 flex flex-col gap-2 w-full px-1')}
            onSubmit={form.handleSubmit(onSubmit)}
          >
            {
              showHost && (
                <FormField
                  control={form.control}
                  name="host"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Host</FormLabel>
                      <FormControl>
                        <Input placeholder="ws://localhost:3001/module" {...field} />
                      </FormControl>
                      <FormDescription></FormDescription>
                      <FormMessage/>
                    </FormItem>
                  )}
                />
              )
            }
            <FormField
              control={form.control}
              name="name"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="board-1" {...field} />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage/>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="token"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Token</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="your token"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage/>
                </FormItem>
              )}
            />
            <div className="flex justify-between">
              <Button type="button" variant="link" onClick={handleChangeHost}>
                Change host
              </Button>
              <Button
                type="submit"
                disabled={isSaving}
              >
                {isSaving && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin"/>
                )}
                Connect
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  )
}