import React from 'react'

const SpinnerLoader = () => {
  return (
    <div className="flex justify-center items-center py-4" role="status">
      <div className="w-6 h-6 border-4 border-gray-300 border-t-cyan-900 rounded-full animate-spin"></div>
      <span className="sr-only">Loading...</span>
    </div>
  )
}

export default SpinnerLoader