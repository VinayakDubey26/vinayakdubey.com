import WebsiteCard from "./WebsiteCard";
import DesktopSoftwareCard from "./DesktopSoftwareCard";
import MobileAppCard from "./MobileAppCard";

const ProjectCard = ({ project, ...props }) => {
  if (project.detailVariant === "mobile-split") {
    return <MobileAppCard project={project} {...props} />;
  }
  if (project.category === "website") {
    return <WebsiteCard project={project} {...props} />;
  }
  return <DesktopSoftwareCard project={project} {...props} />;
};

export default ProjectCard;
