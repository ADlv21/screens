import React from 'react'
import UnifiedWhiteboard from '../../components/UnifiedWhiteboard'


const ProjectPage = async ({ params }: { params: Promise<{ projectid: string }> }) => {
    const { projectid } = await params;

    const baseUrl = "https://ota-update-950b5c193b76.s3.ap-south-1.amazonaws.com/fryer/deployment/"
    const files = ["index.html", "progress.html", "session.html"]

    const designs = files.map((file) => {
        return {
            key: file,
            url: `${baseUrl}${file}`,
            name: file.split(".")[0].charAt(0).toUpperCase() + file.split(".")[0].slice(1).toLocaleLowerCase() + " Page",
            x: 0,
            y: 0,
            width: 400,
            height: 300
        }
    })

    console.log(`Loading project: ${projectid}`)
    console.log(designs)

    return (
        <UnifiedWhiteboard designs={designs} />
    )
}

export default ProjectPage 