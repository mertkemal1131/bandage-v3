import { Star } from 'lucide-react'

/**
 * Star rating display
 * @param {number} rating   - filled stars (0–5)
 * @param {number} size     - icon size in px (default 18)
 * @param {number} total    - total stars (default 5)
 */
export default function Stars({ rating = 5, size = 18, total = 5 }) {
  return (
    <div className="flex gap-[5px]">
      {Array.from({ length: total }, (_, i) => (
        <Star
          key={i}
          size={size}
          color="#F3CD03"
          fill={i < rating ? '#F3CD03' : 'none'}
          strokeWidth={1.5}
        />
      ))}
    </div>
  )
}
