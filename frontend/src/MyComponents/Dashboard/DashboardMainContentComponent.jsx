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
      <div className="w-fit rounded-md bg-gray-50 border px-4 py-3 shadow-sm">
        <div className="flex items-center gap-2">
          <Github className="size-5 text-gray-700"/>
          <span className="font-semibold text-gray-700">Linked GitHub Repo:</span>
          {selectedProject?.githubUrl && (
            <a
              href={selectedProject.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 hover:underline font-mono"
            >
              {selectedProject.githubUrl.split('/').slice(-2).join('/')}
              <ExternalLink className="ml-1 size-4" />
            </a>
          )}
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
        <AskQuestionCard/>
      </div>
      <div className="mt-8"></div>
      <CommitDisplay/>
    </div>
  );
}

export default DashboardMainContentComponent;