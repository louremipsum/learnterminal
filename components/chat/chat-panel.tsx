import { PromptForm } from '@/components/chat/prompt-form'
import { ButtonScrollToBottom } from '../button-scroll-to-bottom'
import { UIState } from '@/lib/chat/actions'
import React from 'react'

export interface ChatPanelProps {
  id?: string
  title?: string
  input: string
  setInput: (value: string) => void
  isAtBottom: boolean
  scrollToBottom: () => void

  messagesUIState: UIState
  setMessagesUIState: React.Dispatch<React.SetStateAction<UIState>>
}

const exampleMessages = [
  {
    heading: 'Strength Training',
    subheading: 'How often should I change my strength training routine?',
    message: `How often should I change my strength training routine?`
  },
  {
    heading: 'Nutrition',
    subheading: 'What dietary changes do you recommend for my fitness goals?',
    message: 'What dietary changes do you recommend for my fitness goals?'
  },
  {
    heading: 'Supplementation',
    subheading:
      'What essential supplements should I consider to gain muscle mass?',
    message: `What essential supplements should I consider to gain muscle mass?`
  },
  {
    heading: 'Injury Prevention',
    subheading: 'What are common ways to prevent injuries during training?',
    message: `What are common ways to prevent injuries during training?`
  }
]

export function ChatPanel({
  id,
  title,
  input,
  setInput,
  isAtBottom,
  scrollToBottom,
  messagesUIState,
  setMessagesUIState
}: ChatPanelProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 w-full duration-300 ease-in-out animate-in peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px]">
      <ButtonScrollToBottom
        isAtBottom={isAtBottom}
        scrollToBottom={scrollToBottom}
      />

      <div className="mx-auto sm:max-w-2xl sm:px-4">
        <div className="mb-4 grid grid-cols-2 gap-2 px-4 sm:px-0">
          {/* {messages.length === 0 &&
            exampleMessages.map((example, index) => (
              <div
                key={example.heading}
                className={`cursor-pointer rounded-lg border bg-white p-4 hover:bg-zinc-50 dark:bg-zinc-950 dark:hover:bg-zinc-900 ${
                  index > 1 && 'hidden md:block'
                }`}
                onClick={async () => {
                  setMessages(currentMessages => [
                    ...currentMessages,
                    {
                      id: nanoid(),
                      display: <UserMessage>{example.message}</UserMessage>
                    }
                  ])

                  const responseMessage = await submitUserMessage(
                    example.message
                  )

                  setMessages(currentMessages => [
                    ...currentMessages,
                    responseMessage
                  ])
                }}
              >
                <div className="text-sm font-semibold">{example.heading}</div>
                <div className="text-sm text-zinc-600">
                  {example.subheading}
                </div>
              </div>
            ))} */}
        </div>

        <div className="space-y-4  py-2 sm:rounded-t-xl px-4 md:py-4">
          <React.Suspense fallback={<div>Loading...</div>}>
            <PromptForm
              input={input}
              setInput={setInput}
              messagesUIState={messagesUIState}
              setMessagesUIState={setMessagesUIState}
            />
          </React.Suspense>
        </div>
      </div>
    </div>
  )
}
