import { getProjectHtmlUrl } from '@/lib/supabase/getProjectHtmlUrl';
import ProjectFlow from './ProjectFlow';

const ProjectPage = async ({ params }: { params: Promise<{ projectid: string }> }) => {
    const { projectid } = await params;
    const htmlUrl = await getProjectHtmlUrl(projectid);
    return <ProjectFlow htmlUrl={htmlUrl} />;
};

export default ProjectPage;