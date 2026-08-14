import { DashboardContent } from "../../components/Dashboard/Content/DashboardContent";
import { DashboardHeader } from "../../components/Dashboard/Header/DashboardHeader";
import { DashboardNavigation } from "../../components/Dashboard/Navigation/DashboardNavigation.module";

export const Dashboard = () => {
  return (
    <main>
      <DashboardHeader />

       <DashboardNavigation />

        <DashboardContent />
    </main>
  );
};