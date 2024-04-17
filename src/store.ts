import {create} from 'zustand'
import {v4 as uuid} from 'uuid'
import {JSONRPCClient, JSONRPCErrorException, JSONRPCServer, JSONRPCServerAndClient} from "json-rpc-2.0";

import {defaultBoards, EVNTBOARD_KEY_DATA, EVNTBOARD_KEY_TEMP, MODULE_CODE} from '@/constants.ts'
import {BoardT, ButtonT, TmpDataT} from "@/types.ts";
import * as z from "zod";

let ws: WebSocket | null

const serverAndClient = new JSONRPCServerAndClient(
  new JSONRPCServer(),
  new JSONRPCClient((request) => {
    try {
      ws?.send(JSON.stringify(request))
      return Promise.resolve()
    } catch (error) {
      return Promise.reject(error)
    }
  }, () => uuid())
)

interface AppState {
  connected: boolean
  moduleName: string | null
  startListening: (props: { host: string, token: string, name: string }) => Promise<void>
  boards: Array<BoardT>
  tmp: Array<TmpDataT>
  selectedBoardId: string | null
  override: Record<string, never>
  emitButtonClick: (props: { button: ButtonT }) => void
  switchBoard: (props: { button: ButtonT }) => void
  saveBoard: (board: BoardT) => Promise<void>
}

export const useAppStore = create<AppState>((set, get) => ({
  connected: false,
  moduleName: null,
  tmp: [],
  boards: [],
  selectedBoardId: null,
  override: {},
  startListening: ({host, token, name}): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      ws = new window.WebSocket(host)

      ws.onopen = async () => {

        serverAndClient.addMethod('storage.sync', (data) => {
          if (data.key === EVNTBOARD_KEY_DATA) {
            set({
              boards: data.value,
            })
          }
          if (data.key === EVNTBOARD_KEY_TEMP) {
            set({
              tmp: data.value,
            })
          }
        })

        serverAndClient.addMethod('updateText', async (data: string) => {
          const schema = z.object({
            slug: z.string(),
            text: z.string()
          })

          const params = schema.safeParse(data)

          if (!params.success) {
            return new JSONRPCErrorException(
              'Invalid params',
              213,
              params.error.issues
            )
          }

          const old: TmpDataT[] = await serverAndClient.request('storage.get', {
            key: EVNTBOARD_KEY_TEMP
          })

          const newButtonData = {
            ...(old.find(({ slug }) => slug === params.data.slug) ?? {}),
            slug: params.data.slug,
            text: params.data.text
          }

          await serverAndClient.request('storage.set', {
            key: EVNTBOARD_KEY_TEMP,
            value: [
              ...old.filter(({ slug }) => slug !== params.data.slug),
              newButtonData
            ],
          })
        })

        serverAndClient.addMethod('updateColor', async (data: string) => {
          const schema = z.object({
            slug: z.string(),
            color: z.string()
          })

          const params = schema.safeParse(data)

          if (!params.success) {
            return new JSONRPCErrorException(
              'Invalid params',
              213,
              params.error.issues
            )
          }

          const old: TmpDataT[] = await serverAndClient.request('storage.get', {
            key: EVNTBOARD_KEY_TEMP
          })

          const newButtonData = {
            ...(old.find(({ slug }) => slug === params.data.slug) ?? {}),
            slug: params.data.slug,
            color: params.data.color
          }

          await serverAndClient.request('storage.set', {
            key: EVNTBOARD_KEY_TEMP,
            value: [
              ...old.filter(({ slug }) => slug !== params.data.slug),
              newButtonData
            ],
          })
        })

        serverAndClient.addMethod('updateImage', async (data: string) => {
          const schema = z.object({
            slug: z.string(),
            image: z.string()
          })

          const params = schema.safeParse(data)

          if (!params.success) {
            return new JSONRPCErrorException(
              'Invalid params',
              213,
              params.error.issues
            )
          }

          const old: TmpDataT[] = await serverAndClient.request('storage.get', {
            key: EVNTBOARD_KEY_TEMP
          })

          const newButtonData = {
            ...(old.find(({ slug }) => slug === params.data.slug) ?? {}),
            slug: params.data.slug,
            image: params.data.image
          }

          await serverAndClient.request('storage.set', {
            key: EVNTBOARD_KEY_TEMP,
            value: [
              ...old.filter(({ slug }) => slug !== params.data.slug),
              newButtonData
            ],
          })
        })

        try {
          await serverAndClient.request('session.register', {
            code: MODULE_CODE,
            name,
            token,
            subs: [EVNTBOARD_KEY_DATA, EVNTBOARD_KEY_TEMP]
          })

          let boardsPersisted: Array<BoardT> = []

          try {
            boardsPersisted = await serverAndClient.request('storage.get', {
              key: EVNTBOARD_KEY_DATA,
            })
            if (boardsPersisted === null) {
              throw new Error('no data')
            }
          } catch (e) {
            boardsPersisted = await serverAndClient.request('storage.set', {
              key: EVNTBOARD_KEY_DATA,
              value: defaultBoards,
            })
          }

          let boardsTmp: Array<TmpDataT> = []
          try {
            boardsTmp = await serverAndClient.request('storage.get', {
              key: EVNTBOARD_KEY_TEMP,
            })
            if (boardsTmp === null) {
              throw new Error('no data')
            }
          } catch (e) {
            boardsTmp = await serverAndClient.request('storage.set', {
              key: EVNTBOARD_KEY_TEMP,
              value: [],
            })
          }

          if (boardsPersisted.length > 0) {
            set({
              tmp: boardsTmp,
              boards: boardsPersisted,
              moduleName: name,
              connected: true,
              selectedBoardId: boardsPersisted[0].id
            })
            resolve()
          } else {
            reject()
          }
        } catch (e) {
          reject(e)
          set({
            boards: [],
            moduleName: undefined,
            connected: false,
            selectedBoardId: undefined
          })
        }
      }

      ws.onmessage = (event) => {
        serverAndClient.receiveAndSend(JSON.parse(event.data.toString()))
      }

      ws.onclose = (event) => {
        serverAndClient.rejectAllPendingRequests(`Connection is closed (${event.reason}).`)
        set({connected: false})
      }

      ws.onerror = (event) => {
        console.error('error a', event)
        reject()
        set({connected: false})
      }
    })
  },
  saveBoard: async (board: BoardT) => {
    const state = get()
    try {
      const currentIndex = state.boards.findIndex(({ id }) => id === board.id)
      if (currentIndex === -1) { // this is a create
        await serverAndClient.request('storage.set', {
          key: EVNTBOARD_KEY_DATA,
          value: [
            ...state.boards,
            board
          ],
        })
      } else { // this is an update
        const newBoards = [...state.boards]
        newBoards[currentIndex] = board
        await serverAndClient.request('storage.set', {
          key: EVNTBOARD_KEY_DATA,
          value: newBoards,
        })
      }
    } catch (e) {
      console.log(e)
    }
  },
  emitButtonClick: (props) => {
    if (!serverAndClient) {
      throw new Error("Not possible")
    }

    serverAndClient?.notify(
      "event.new",
      {
        name: "board-button-click",
        payload: props.button,

      }
    )
  },
  switchBoard: (props) => {
    const state = get()
    const switchTo = state.boards.find((board) => board.slug === props.button.text)

    if (switchTo) {
      set({
        selectedBoardId: switchTo.id
      })
    } else {
      throw new Error('No board for this slug !')
    }
  }
}))