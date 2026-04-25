import React from 'react'
import { FaRegStar, FaStar } from 'react-icons/fa'

export default function StarRating({ value = 0}) {
  const safeValue = Math.max(0, Math.min(5, value));
  return (
    <div className="text-yellow-500 text-xs flex gap-1">
      {[...Array(5)].map((_, index) =>
        index < Math.round(safeValue) ? (
          <FaStar key={index} />
        ) : (
          <FaRegStar key={index} />
        )
      )}
    </div>
  )
}
