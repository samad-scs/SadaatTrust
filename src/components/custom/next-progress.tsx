// ** React Imports
import React from 'react'

// ** Third Party Imports
import NextTopLoader from 'nextjs-toploader'

const NextProgress = () => {
  // ** Vars
  const color = 'oklch(0.663 0.139 252.02406933281515)'

  return (
    <NextTopLoader
      color={color}
      initialPosition={0.1}
      crawlSpeed={400}
      height={4}
      crawl={true}
      showSpinner={false}
      speed={500}
      shadow={`'0 0 10px ${color},0 0 5px ${color}'`}
      zIndex={1600}
    />
  )
}

export default NextProgress
