import { Separator } from '@/components/ui/separator'
import { UIState } from '@/lib/chat/actions'

export interface ChatList {
  messagesUIState: UIState
}

export function ChatList({ messagesUIState }: ChatList) {
  if (!messagesUIState.length) {
    return null
  }

  return (
    <div className="relative mx-auto max-w-2xl px-4">
      {messagesUIState.map((message, index) => (
        <div key={message.id}>
          {message.display}
          {index < messagesUIState.length - 1 && <Separator className="my-4" />}
        </div>
      ))}
    </div>
  )
}
