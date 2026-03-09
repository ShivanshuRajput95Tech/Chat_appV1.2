import { useEffect, useState, useMemo } from "react"
import { useChatStore } from "../../store/chatStore"
import { useAuthStore } from "../../store/authStore"
import Avatar from "../ui/Avatar"
import { getPeople } from "../../api/peopleApi"

export default function UserList() {

  const onlineUsers = useChatStore((s) => s.onlineUsers) || []
  const setSelectedUser = useChatStore((s) => s.setSelectedUser)
  const selectedUser = useChatStore((s) => s.selectedUser)

  const currentUser = useAuthStore((s) => s.user)

  const [allUsers, setAllUsers] = useState([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    const loadUsers = async () => {
      try {
        const users = await getPeople()

        // remove current user from list
        const filtered = users.filter(u => u._id !== currentUser?._id)

        setAllUsers(filtered)

      } catch (error) {
        console.error("Failed to load users:", error)
      } finally {
        setLoading(false)
      }
    }

    loadUsers()

  }, [currentUser])

  const searchTerm = search.toLowerCase()

  const filteredUsers = useMemo(() => {

    return allUsers.filter((user) => {

      const name =
        `${user.firstName || ""} ${user.lastName || ""}`.toLowerCase()

      return name.includes(searchTerm)

    })

  }, [allUsers, searchTerm])

  const noResults = !loading && filteredUsers.length === 0

  return (

    <div className="flex flex-col h-full bg-slate-900/50 backdrop-blur-sm">

      {/* HEADER */}

      <div className="p-4 border-b border-slate-700/50">

        <h2 className="text-lg font-semibold text-white mb-3">
          Users
        </h2>

        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm text-gray-200"
        />

      </div>

      {/* USERS */}

      <div className="flex-1 overflow-y-auto p-2">

        {loading && (
          <div className="text-center text-gray-400 py-8">
            Loading users...
          </div>
        )}

        {noResults && (
          <div className="text-center text-gray-400 py-8">
            No users found
          </div>
        )}

        {!loading && filteredUsers.map((user) => {

          const isOnline = onlineUsers.some(
            (online) => online.userId === user._id
          )

          const isSelected = selectedUser === user._id

          return (

            <div
              key={user._id}
              onClick={() => setSelectedUser(user._id)}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                isSelected
                  ? "bg-blue-600 text-white"
                  : "hover:bg-slate-800 text-gray-200"
              }`}
            >

              <Avatar
                name={`${user.firstName} ${user.lastName}`}
                size="sm"
                className={isOnline ? "ring-2 ring-green-500" : ""}
              />

              <div className="flex-1 min-w-0">

                <div className="font-medium truncate">
                  {user.firstName} {user.lastName}
                </div>

                <div className="text-xs text-gray-400">
                  {isOnline ? "Online" : "Offline"}
                </div>

              </div>

            </div>

          )

        })}

      </div>

    </div>
  )
}