import '@xyflow/react/dist/style.css';

import { BaseNode } from '@/components/base-node'
import React from 'react'

const page = () => {
  return (
    <div className="w-screen h-screen p-8">
      <BaseNode selected={false}>Hi! 👋</BaseNode>
    </div>
  )
}

export default page