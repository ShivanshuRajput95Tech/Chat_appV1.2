import { useState, useEffect, useMemo } from "react"
import { useChatStore } from "../store/chatStore"
import Avatar from "../components/ui/Avatar"

export default function ChatLayout({ sidebar, main }) {

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)

  const selectedUser = useChatStore((s) => s.selectedUser)
  const selectedGroup = useChatStore((s) => s.selectedGroup)
  const onlineUsers = useChatStore((s) => s.onlineUsers)
  const groups = useChatStore((s) => s.groups)

  /* Responsive detection */

  useEffect(() => {

    const mobileQuery = window.matchMedia("(max-width: 767px)")
    const tabletQuery = window.matchMedia("(min-width:768px) and (max-width:1023px)")

    const update = () => {
      setIsMobile(mobileQuery.matches)
      setIsTablet(tabletQuery.matches)
    }

    update()

    mobileQuery.addEventListener?.("change", update)
    mobileQuery.addListener?.(update)

    tabletQuery.addEventListener?.("change", update)
    tabletQuery.addListener?.(update)

    return () => {
      mobileQuery.removeEventListener?.("change", update)
      mobileQuery.removeListener?.(update)

      tabletQuery.removeEventListener?.("change", update)
      tabletQuery.removeListener?.(update)
    }

  }, [])

  /* Close sidebar on mobile when chat selected */

  useEffect(() => {
    if (isMobile && (selectedUser || selectedGroup)) {
      setSidebarOpen(false)
    }
  }, [selectedUser, selectedGroup, isMobile])

  /* Online lookup */

  const onlineSet = useMemo(
    () => new Set((onlineUsers || []).map((u) => u._id)),
    [onlineUsers]
  )

  /* Group map for faster lookup */

  const groupMap = useMemo(() => {

    const map = new Map()

    for (const g of groups || []) {
      map.set(g._id, g)
    }

    return map

  }, [groups])

  /* Chat header info */

  const chatInfo = useMemo(() => {

    if (selectedGroup) {

      const group = groupMap.get(selectedGroup)

      if (group) {

        const members = group.members || []
        const onlineCount = members.filter((m) => onlineSet.has(m)).length

        return {
          name: group.name || "Group",
          avatar: group.name?.charAt(0)?.toUpperCase() || "G",
          status: `${members.length} members${onlineCount ? ` • ${onlineCount} online` : ""}`,
          isOnline: onlineCount > 0
        }
      }
    }

    if (selectedUser) {

      const isOnline = onlineSet.has(selectedUser)

      return {
        name: "User",
        avatar: "U",
        status: isOnline ? "Online" : "Offline",
        isOnline
      }
    }

    return {
      name: "Select a chat",
      avatar: "?",
      status: "Choose a conversation to start messaging",
      isOnline: false
    }

  }, [selectedUser, selectedGroup, groupMap, onlineSet])

  return (

    <div className="h-screen w-full flex bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-gray-200 overflow-hidden">

      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}

      <div
        className={`
          fixed md:relative inset-y-0 left-0 z-50 flex flex-col
          transition-transform duration-300
          ${isMobile ? "w-80" : isTablet ? "w-72" : "w-80"}
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          bg-slate-900/95 md:bg-slate-900/50
          border-r border-slate-700/50
        `}
      >
        {sidebar}
      </div>

      {/* Main Area */}

      <div className="flex-1 flex flex-col min-w-0">

        <div
          className={`
            bg-slate-900/50 border-b border-slate-700/50
            flex items-center gap-4
            ${isMobile ? "h-14 px-4" : "h-16 px-6"}
          `}
        >

          <button
            aria-label="Toggle chat list"
            onClick={() => setSidebarOpen((s) => !s)}
            className="md:hidden p-2 rounded-lg bg-slate-800 hover:bg-slate-700"
          >
            ☰
          </button>

          <div className="flex items-center gap-3 flex-1">

            <div className="relative">

              <Avatar name={chatInfo.avatar} size={isMobile ? "xs" : "sm"} />

              {chatInfo.isOnline && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full" />
              )}

            </div>

            <div className="min-w-0">

              <h2 className="font-semibold truncate">
                {chatInfo.name}
              </h2>

              <p
                className={`text-sm truncate ${
                  chatInfo.isOnline ? "text-green-400" : "text-gray-400"
                }`}
              >
                {chatInfo.status}
              </p>

            </div>

          </div>

        </div>

        <div className="flex-1 overflow-hidden relative">
          {main}
        </div>

        {isMobile && !selectedUser && !selectedGroup && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-800/90 rounded-full px-4 py-2 text-sm animate-bounce">
            Select a chat to start messaging
          </div>
        )}

      </div>

    </div>

  )
}