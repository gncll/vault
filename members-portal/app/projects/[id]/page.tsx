import SubscriptionCheck from '@/app/components/SubscriptionCheck'
import { getProjectDetails } from '@/lib/github'
import ProjectViewer from './ProjectViewer'

export default async function ProjectViewerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const project = await getProjectDetails(id)

  return (
    <SubscriptionCheck>
      <ProjectViewer project={project} />
    </SubscriptionCheck>
  )
}
