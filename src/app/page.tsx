import React from 'react'
import Link from 'next/link'

const page = () => {
  // Example projects - you can make this dynamic
  const projects = [
    { id: 'fryer', name: 'Fryer Project', description: 'Interactive whiteboard for fryer deployment' },
    { id: 'demo', name: 'Demo Project', description: 'Sample project for testing' },
    { id: 'test', name: 'Test Project', description: 'Another test project' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Screens Whiteboard
          </h1>
          <p className="text-xl text-gray-600">
            Interactive canvas-based whiteboard for viewing and organizing web content
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/${project.id}`}
              className="block group"
            >
              <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 border border-gray-200 hover:border-blue-300">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {project.name}
                  </h2>
                  <div className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    →
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  {project.description}
                </p>
                <div className="text-sm text-gray-500">
                  Project ID: {project.id}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              How to Use
            </h3>
            <p className="text-blue-800">
              Click on any project above to open the interactive whiteboard.
              Use mouse wheel to zoom, drag to pan, and click and drag designs to move them around the canvas.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default page