import { memo, useMemo } from "react"

const sizeClasses = {
  xs: "w-6 h-6 text-xs",
  sm: "w-8 h-8 text-sm",
  md: "w-10 h-10 text-base",
  lg: "w-12 h-12 text-lg",
  xl: "w-16 h-16 text-xl"
}

const colors = [
  "bg-indigo-600",
  "bg-blue-600",
  "bg-green-600",
  "bg-purple-600",
  "bg-pink-600",
  "bg-orange-600"
]

const Avatar = memo(({ name = "", size = "md", bgColor, textColor = "text-white", className = "" }) => {

  const safeName = typeof name === "string" ? name.trim() : ""

  const initial = safeName ? safeName.charAt(0).toUpperCase() : "?"

  const sizeClass = sizeClasses[size] || sizeClasses.md

  const color = useMemo(() => {
    if (bgColor) return bgColor

    const index = safeName.length % colors.length
    return colors[index]
  }, [safeName, bgColor])

  return (

    <div
      role="img"
      aria-label={safeName || "User avatar"}
      title={safeName || "User"}
      className={`${sizeClass} ${color} ${textColor} ${className} rounded-full flex items-center justify-center font-semibold select-none transition-all duration-200`}
    >
      {initial}
    </div>

  )
})

Avatar.displayName = "Avatar"

export default Avatar