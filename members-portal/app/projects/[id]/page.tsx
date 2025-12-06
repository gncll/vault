import SubscriptionCheck from '@/app/components/SubscriptionCheck'
import { getProjectDetails } from '@/lib/github'
import ProjectViewer from './ProjectViewer'

export default async function ProjectViewerPage({ params }: { params: { id: string } }) {
  const project = await getProjectDetails(params.id)

  return (
    <SubscriptionCheck>
      <ProjectViewer project={project} />
    </SubscriptionCheck>
  )
}
