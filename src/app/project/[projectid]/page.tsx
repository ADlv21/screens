import { getProjectScreens } from '@/lib/supabase/getProjectScreens';
import ProjectFlow from './ProjectFlow';

const ProjectPage = async ({ params }: { params: Promise<{ projectid: string }> }) => {
    const { projectid } = await params;
    const screens = await getProjectScreens(projectid);
    return <ProjectFlow screens={screens} projectId={projectid} />;
};

export default ProjectPage;