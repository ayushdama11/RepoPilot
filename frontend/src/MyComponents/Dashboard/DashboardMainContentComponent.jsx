import useProject from "@/hooks/use-project";
import useSelectedProject from "@/hooks/use-selected-project";
import { ExternalLink, Github } from "lucide-react";
import { Link } from "react-router-dom";
import CommitDisplay from "../Commit/CommitDisplay";
import AskQuestionCard from "./AskQuestionCard";
import ArchiveProject from "./ArchiveProject";
import InviteButton from "./InviteButton";
import TeamMembers from "./TeamMembers";

function DashboardMainContentComponent() {
  const { selectedProject,isLoading } = useProject();



  return (
    <div>
     <div className="flex items-center justify-between flex-wrap gap-y-4">
        {/* github Link */}
      <div className="w-fit rounded-md bg-primary px-4 py-3">
        <div className="flex items-center">
          <Github className="size-5 text-white"/>
          <div className="ml-2">
            <p className="text-sm font-medium text-white">
              This Project is linked to {' '}
              <Link to={selectedProject?.githubUrl ?? ""} className="inline-flex items-center text-white/80 hover:underline">
              {selectedProject?.githubUrl}
              <ExternalLink classNeme='ml-1 size-4' />
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="h-4"></div>
      <div className="flex items-center gap-4">
        <TeamMembers />
        <InviteButton/>
       <ArchiveProject/>
      </div>
    
     </div>
     
     <div className="mt-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
          <AskQuestionCard/>
          MeetingCard
        </div>
      </div>
      <div className="mt-8"></div>
      <CommitDisplay/>
    </div>
  );
}

export default DashboardMainContentComponent;