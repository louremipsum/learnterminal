'use client'

import * as React from 'react'
import Textarea from 'react-textarea-autosize'

import { Button } from '@/components/ui/button'
import { IconArrowElbow, IconPlus } from '@/components/ui/icons'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { postChat } from '@/lib/api/api'
import { useEnterSubmit } from '@/lib/hooks/use-enter-submit'
import { useRouter } from 'next/navigation'
import { revalidate } from '@/lib/utils/actions'
import { UIState } from '@/lib/chat/actions'
import { BotMessage, ToolMessage, UserMessage } from './message'
import { nanoid } from '@/lib/utils'
import { parseAsStringLiteral, useQueryState } from 'nuqs'
import { QUERY_STATE_KEYS, SUPPORTED_MODELS } from '@/lib/utils/constants'
import { spinner } from './spinner'

export function PromptForm({
  input,
  setInput,
  messagesUIState,
  setMessagesUIState
}: {
  input: string
  setInput: (value: string) => void
  messagesUIState: UIState
  setMessagesUIState: React.Dispatch<React.SetStateAction<UIState>>
}) {
  const router = useRouter()
  const { formRef, onKeyDown } = useEnterSubmit()
  const inputRef = React.useRef<HTMLTextAreaElement>(null)
  const [model] = useQueryState(
    QUERY_STATE_KEYS.MODEL,
    parseAsStringLiteral(SUPPORTED_MODELS)
  )

  const [isSubmitMessageLoading, startSubmitMessageTransition] =
    React.useTransition()

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  return (
    <form
      ref={formRef}
      onSubmit={async (e: any) => {
        e.preventDefault()

        // Blur focus on mobile
        if (window.innerWidth < 600) {
          e.target['message']?.blur()
        }

        const value = input.trim()
        setInput('')
        if (!value) return

        // Optimistically add user message UI
        setMessagesUIState(currentMessages => {
          return [
            ...currentMessages,
            {
              id: nanoid(),
              display: <UserMessage>{value}</UserMessage>
            }
          ]
        })

        // Submit and get response message
        startSubmitMessageTransition(async () => {
          const responseMessage = await postChat(value, model ?? undefined)
          setMessagesUIState(currentMessages => [
            ...currentMessages,
            ...(responseMessage.toolResponses?.length
              ? [
                  {
                    id: nanoid(),
                    display: (
                      <ToolMessage
                        toolResponses={responseMessage.toolResponses}
                      />
                    )
                  }
                ]
              : []),
            {
              id: nanoid(),
              display: <BotMessage content={responseMessage.message} />
            }
          ])
        })
      }}
    >
      <div className="relative flex max-h-60 w-full grow flex-col overflow-hidden bg-background px-8 sm:rounded-md sm:border sm:px-12">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-0 top-[14px] size-8 rounded-full bg-background p-0 sm:left-4"
              onClick={() => {
                router.push('/new')
              }}
            >
              <IconPlus />
              <span className="sr-only">New Chat</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>New Chat</TooltipContent>
        </Tooltip>
        <Textarea
          ref={inputRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          placeholder="Send a message."
          className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm"
          autoFocus
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          name="message"
          rows={1}
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <div className="absolute right-0 top-[13px] sm:right-4">
          {isSubmitMessageLoading ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button type="button" size="icon" disabled>
                  {spinner}
                  <span className="sr-only">Loading Response</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Loading...</TooltipContent>
            </Tooltip>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button type="submit" size="icon" disabled={input === ''}>
                  <IconArrowElbow />
                  <span className="sr-only">Send message</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Send message</TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </form>
  )
}
