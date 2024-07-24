'use client'

import { ChatList } from '@/components/chat/chat-list'
import { ChatPanel } from '@/components/chat/chat-panel'
import { EmptyScreen } from '@/components/empty-screen'
import { UIState } from '@/lib/chat/actions'
import { useScrollAnchor } from '@/lib/hooks/use-scroll-anchor'
import { cn } from '@/lib/utils'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export interface ChatProps extends React.ComponentProps<'div'> {
  messagesUIState: UIState
}

export function Chat({ messagesUIState, id, className }: ChatProps) {
  const router = useRouter()
  const path = usePathname()
  const [input, setInput] = useState('')

  const [uiState, setUIState] = useState(messagesUIState)

  useEffect(() => {
    const messagesLength = uiState?.length
    if (messagesLength === 2) {
      router.refresh()
    }
  }, [uiState, router])

  const { messagesRef, scrollRef, visibilityRef, isAtBottom, scrollToBottom } =
    useScrollAnchor()

  return (
    <div
      className="group w-full overflow-auto pl-0 peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]"
      ref={scrollRef}
    >
      <div
        className={cn('pb-[200px] pt-4 md:pt-10', className)}
        ref={messagesRef}
      >
        {messagesUIState.length ? (
          <ChatList messagesUIState={uiState} />
        ) : (
          <EmptyScreen />
        )}
        <div className="h-px w-full" ref={visibilityRef} />
      </div>
      <ChatPanel
        id={id}
        input={input}
        setInput={setInput}
        isAtBottom={isAtBottom}
        scrollToBottom={scrollToBottom}
        messagesUIState={uiState}
        setMessagesUIState={setUIState}
      />
    </div>
  )
}
