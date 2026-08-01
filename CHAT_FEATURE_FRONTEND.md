# Chat Feature - Frontend Implementation

## Overview
Real-time chat for Flat Mate plans. Floating button on plan pages opens a Messenger-style popup with message history, real-time updates, and member presence.

---

## Current State
- ✅ UI components exist: `FloatingChatButton`, `ChatPopup` in `src/components/plan/`
- ✅ Mock data in `src/components/plan/mock-data.ts` (`ChatMessage` type + `chatMessages`)
- ✅ Plan details page at `src/app/(main)/plans/[planId]/page.tsx` uses chat
- ❌ No real API integration
- ❌ No WebSocket connection
- ❌ Chat only on plan details page (not all plan sub-pages)

---

## File Structure After Implementation

```
src/
├── lib/chat/
│   ├── types.ts           # TypeScript interfaces
│   ├── api.ts             # REST API calls (TanStack Query)
│   ├── socket.ts          # WebSocket connection manager
│   └── index.ts           # Barrel export
├── hook/
│   └── useChat.ts         # Main chat hook (state + actions)
├── components/plan/
│   ├── FloatingChatButton.tsx  # Updated: real unread count, planId prop
│   ├── ChatPopup.tsx           # Updated: useChat hook, real send
│   └── mock-data.ts            # Remove chatMessages export
├── provider/
│   └── ChatProvider.tsx        # Socket lifecycle per plan
└── app/(main)/plans/
    └── layout.tsx              # Wrap with ChatProvider
```

---

## Implementation Phases

### Phase 1: Types & API Layer (`lib/chat/`)

**`types.ts`**
```typescript
export interface ChatMessage {
  id: string;
  planId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
  isRead: boolean;
}

export interface ChatMember {
  userId: string;
  name: string;
  avatar: string;
  isOnline: boolean;
}

export interface SendMessageDTO {
  planId: string;
  content: string;
}

export interface UnreadCount {
  planId: string;
  count: number;
}
```

**`api.ts`** - TanStack Query hooks
```typescript
// GET /chat/plans/:planId/messages
export const useChatMessages = (planId: string, cursor?: string) => ...

// POST /chat/plans/:planId/messages
export const useSendMessage = () => ...

// GET /chat/plans/:planId/members
export const useChatMembers = (planId: string) => ...

// GET /chat/unread-counts
export const useUnreadCounts = () => ...
```

### Phase 2: WebSocket Manager (`lib/chat/socket.ts`)

```typescript
class ChatSocket {
  private socket: Socket | null = null;
  private planId: string | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  
  connect(planId: string, token: string): Promise<void>
  disconnect(): void
  on(event: string, handler: Function): void
  off(event: string, handler: Function): void
  send(event: string, data: any): void
  
  // Event helpers
  sendMessage(content: string, tempId: string): void
  startTyping(): void
  stopTyping(): void
  markRead(messageId: string): void
}
```

**Events to handle:**
- `message:new` → add to messages state
- `message:sent` → replace tempId with real messageId
- `member:join` / `member:leave` → update online members
- `typing:user` → show/hide typing indicator
- `read:receipt` → update read status
- `error` → toast notification

### Phase 3: Chat Hook (`hook/useChat.ts`)

```typescript
function useChat(planId: string) {
  // State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [onlineMembers, setOnlineMembers] = useState<ChatMember[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  
  // TanStack Query
  const { data: initialMessages } = useChatMessages(planId);
  const { data: members } = useChatMembers(planId);
  const sendMutation = useSendMessage();
  
  // Socket lifecycle
  useEffect(() => {
    const socket = chatSocket.connect(planId, token);
    socket.on('message:new', handleNewMessage);
    socket.on('member:join', handleMemberJoin);
    // ... cleanup on unmount
  }, [planId]);
  
  // Actions
  const sendMessage = (content: string) => {
    const tempId = `temp-${Date.now()}`;
    setMessages(prev => [...prev, { ...optimisticMessage, id: tempId }]);
    chatSocket.sendMessage(content, tempId);
    sendMutation.mutate({ planId, content });
  };
  
  const markAsRead = () => { ... };
  
  return { messages, onlineMembers, unreadCount, isConnected, typingUsers, sendMessage, markAsRead };
}
```

### Phase 4: Component Updates

**`FloatingChatButton.tsx`**
- Add `planId` prop (required)
- Use `useUnreadCounts()` or `useChat(planId).unreadCount`
- Show real unread badge

**`ChatPopup.tsx`**
- Accept `planId` prop
- Use `useChat(planId)` for all state/actions
- Remove local `inputValue` state → use hook
- Show typing indicator: "Rahim is typing..."
- Show online member avatars in header
- Auto-scroll to bottom on new message
- Enter to send, Shift+Enter for newline

### Phase 5: Plan Layout Integration

**`src/app/(main)/plans/layout.tsx`**
```tsx
import { ChatProvider } from '@/provider/ChatProvider';
import FloatingChatButton from '@/components/plan/FloatingChatButton';
import ChatPopup from '@/components/plan/ChatPopup';
import { useParams } from 'next/navigation';

export default function PlansLayout({ children }) {
  const { planId } = useParams();
  
  return (
    <ChatProvider planId={planId as string}>
      {children}
      <FloatingChatButton planId={planId as string} />
      <ChatPopup planId={planId as string} />
    </ChatProvider>
  );
}
```

**`src/provider/ChatProvider.tsx`**
- Initialize socket connection for `planId`
- Provide `useChat` context to children
- Cleanup on planId change/unmount

---

## UI/UX Requirements

### Desktop
- Floating button: fixed bottom-right, 56x56px, cyan bg
- Popup: 360px × 500px, positioned above button
- Header: plan name, online count (green dots), minimize/close
- Messages: virtualized list (react-window), own right/others left
- Input: fixed bottom, enter=send, auto-grow height

### Mobile
- Bottom sheet: full width, 70vh max height
- Swipe down to close
- Keyboard avoidance (viewport handling)

### States
- Loading: skeleton messages
- Empty: "No messages yet. Start the conversation!"
- Error: toast + retry button
- Offline: banner "You're offline. Messages will send when reconnected."

---

## Dependencies to Add

```json
{
  "dependencies": {
    "socket.io-client": "^4.7.0",
    "react-window": "^1.8.10"
  },
  "devDependencies": {
    "@types/react-window": "^1.8.8"
  }
}
```

---

## Testing Checklist

- [ ] Open chat on plan details page → loads history
- [ ] Send message → appears instantly (optimistic), confirms via WS
- [ ] Receive message from another user → appears in real-time
- [ ] Switch plan → new chat loads, old socket disconnects
- [ ] Unread badge updates correctly
- [ ] Typing indicator shows/hides
- [ ] Online members list updates
- [ ] Mobile bottom sheet works
- [ ] Reconnection after network loss
- [ ] Mark as read on open

---

## API Contract (Backend Must Implement)

See `CHAT_FEATURE_BACKEND.md` for full specification.

Key endpoints needed:
- `GET /api/chat/plans/:planId/messages?cursor=&limit=50`
- `POST /api/chat/plans/:planId/messages` { content }
- `GET /api/chat/plans/:planId/members`
- `PATCH /api/chat/plans/:planId/read` { messageId }
- `GET /api/chat/unread-counts`
- `WS /ws/chat/:planId?token=`

---

## Environment Variables

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
NEXT_PUBLIC_WS_URL=ws://localhost:5000
```

---

## Migration Notes

1. Remove `chatMessages` from `mock-data.ts`
2. Update `PlanDetailsPage` to not pass mock data to ChatPopup
3. Delete any unused mock imports
4. Ensure `planId` is available in all plan sub-routes