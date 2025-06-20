// /pages/DashboardPage.tsx
import React, { useState, useEffect } from "react";
import CardComponent from "../components/card";
import LineChart from "../components/chart";
import MostSubscribedChannels from "../components/MostSubscribed";
import { BarChartComponent } from "../components/bar-graph";
import { AreaChartComponent } from "../components/area-chart";
import { Loader } from "@/components/globalfiles/loader";
import { toast } from "react-toastify";

// Import API functions
import { getAllProjects, getProjectStatistics } from "@/features/projects/api/projectApi";
import { getAllServices } from "@/features/servicesfolder/api/serviceApi";
import { getAllTeams } from "@/features/teams/components/api/api";
import { getAllBlogs } from "@/features/blog/components/api/api";
import { getAllContacts, getContactStatistics } from "@/features/contact/components/api/api";

// Dashboard Statistics Interface
interface DashboardStats {
  totalProjects: number;
  totalServices: number;
  totalTeams: number;
  totalBlogs: number;
  totalContacts: number;
  activeProjects: number;
  featuredProjects: number;
  pendingContacts: number;
}

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    totalServices: 0,
    totalTeams: 0,
    totalBlogs: 0,
    totalContacts: 0,
    activeProjects: 0,
    featuredProjects: 0,
    pendingContacts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [projectCategories, setProjectCategories] = useState<any[]>([]);
  const [contactStats, setContactStats] = useState<any[]>([]);
  const [recentProjects, setRecentProjects] = useState<any[]>([]);

  // Fetch all dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch all data in parallel
        const [
          projectsResponse,
          projectStatsResponse,
          servicesResponse,
          teamsResponse,
          blogsResponse,
          contactsResponse,
          contactStatsResponse
        ] = await Promise.all([
          getAllProjects({ page: 1, limit: 10 }),
          getProjectStatistics(),
          getAllServices({ page: 1, limit: 10 }),
          getAllTeams({ page: 1, pageSize: 10 }),
          getAllBlogs({ page: 1, pageSize: 10 }),
          getAllContacts({ page: 1, limit: 10 }),
          getContactStatistics()
        ]);

        // Process project data
        const projectData = projectsResponse.data?.data || [];
        const projectStats = projectStatsResponse.data || {};

        // Process services data
        const servicesData = servicesResponse.data?.services || [];

        // Process teams data - use exact same logic as teams page
        let teamsData: any[] = [];
        if (teamsResponse && (teamsResponse.status || teamsResponse.success) && teamsResponse.data) {
          // Use the exact same logic from teams page that works
          // Check for nested structure: result.data.data.teamMembers
          if (teamsResponse.data.data && Array.isArray((teamsResponse.data.data as any).teamMembers)) {
            teamsData = (teamsResponse.data.data as any).teamMembers;
          } else if (Array.isArray((teamsResponse.data as any).teamMembers)) {
            teamsData = (teamsResponse.data as any).teamMembers;
          } else if (Array.isArray(teamsResponse.data.data)) {
            teamsData = teamsResponse.data.data;
          } else if (Array.isArray(teamsResponse.data)) {
            teamsData = teamsResponse.data;
          } else {
            teamsData = [];
          }
        }
        console.log('Full Teams Response:', teamsResponse);
        console.log('Teams Response Data:', teamsResponse.data);
        console.log('Processed Teams Data:', teamsData);
        console.log('Teams Data Length:', teamsData.length);

        // Process blogs data
        const blogsData = (blogsResponse.data as any)?.blogs || (blogsResponse.data as any)?.data || [];

        // Process contacts data
        const contactsData = (contactsResponse.data as any)?.data || [];
        const contactStatsData = (contactStatsResponse.data as any) || {};

        // Update stats
        const teamCount = teamsData.length || 0;
        console.log('Final team count:', teamCount);

        // Get total count from pagination (same logic as teams page)
        let finalTeamCount = teamCount;
        if (teamsResponse && (teamsResponse.status || teamsResponse.success) && teamsResponse.data) {
          // Handle pagination from the API response (nested structure) - same as teams page
          const pagination = (teamsResponse.data.data as any)?.pagination || (teamsResponse.data as any).pagination || {};
          const totalFromPagination = pagination.totalCount || (teamsResponse.data as any).totalItems || teamCount;
          finalTeamCount = totalFromPagination > 0 ? totalFromPagination : teamCount;
        }
        console.log('Team count from array:', teamCount);
        console.log('Final calculated team count:', finalTeamCount);

        setStats({
          totalProjects: (projectStats as any)?.totalProjects || projectData.length,
          totalServices: servicesData.length,
          totalTeams: finalTeamCount,
          totalBlogs: blogsData.length,
          totalContacts: (contactStatsData as any)?.totalContacts || contactsData.length,
          activeProjects: (projectStats as any)?.activeProjects || 0,
          featuredProjects: (projectStats as any)?.featuredProjects || 0,
          pendingContacts: (contactStatsData as any)?.statusStats?.find((s: any) => s._id === 'pending')?.count || 0,
        });

        // Set chart data
        setProjectCategories((projectStats as any)?.categoryStats || []);
        setContactStats((contactStatsData as any)?.statusStats || []);
        setRecentProjects((projectStats as any)?.mostViewed || []);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');

        // Set some default values if API fails
        setStats({
          totalProjects: 0,
          totalServices: 0,
          totalTeams: 0,
          totalBlogs: 0,
          totalContacts: 0,
          activeProjects: 0,
          featuredProjects: 0,
          pendingContacts: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Create dynamic card data based on real stats
  const dynamicCardData = [
    {
      title: "Total Projects",
      count: stats.totalProjects,
      bgImage: "/assets/one-user.png",
    },
    {
      title: "Active Projects",
      count: stats.activeProjects,
      bgImage: "/assets/active.png",
    },
    {
      title: "Total Services",
      count: stats.totalServices,
      bgImage: "/assets/Group.png",
    },
    {
      title: "Team Members",
      count: stats.totalTeams || 0,
      bgImage: "/assets/user.png",
    },
    {
      title: "Blog Posts",
      count: stats.totalBlogs,
      bgImage: "/assets/vdeo.png",
    },
    {
      title: "Total Contacts",
      count: stats.totalContacts,
      bgImage: "/assets/subscibed.png",
    },
    {
      title: "Featured Projects",
      count: stats.featuredProjects,
      bgImage: "/assets/revenue.png",
    },
    {
      title: "Pending Contacts",
      count: stats.pendingContacts,
      bgImage: "/assets/revenue.png",
    },
  ];

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full">
      <div className="flex flex-col flex-grow">
        <main className="p-6 flex-grow overflow-y-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
            <p className="text-gray-600 mt-1">Welcome to your admin dashboard</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
            {dynamicCardData.map((card, index) => (
              <CardComponent
                key={index}
                title={card.title}
                count={card.count}
                bgImage={card.bgImage}
              />
            ))}
          </div>

          {/* Charts Row 1 */}
          <div className="mt-6 flex flex-col lg:flex-row gap-6">
            <div className="flex-1 shadow-xl bg-white rounded-lg p-4">
              <p className="font-bold mb-4">Project Categories Distribution</p>
              <LineChart />
            </div>
            <div className="flex-1 shadow-xl bg-white rounded-lg p-4">
              <p className="font-bold mb-4">Most Viewed Projects</p>
              <MostSubscribedChannels
                channels={recentProjects.map((project: any) => ({
                  name: project.title || `Project ${project.id}`,
                  subscribers: project.views || 0,
                  logo: ""
                }))}
              />
            </div>
          </div>

          {/* Charts Row 2 */}
          <div className="mt-6 flex flex-col lg:flex-row gap-6">
            {/* Contact Status Distribution */}
            <div className="flex-1 shadow-xl bg-white rounded-lg p-4">
              <p className="font-bold mb-4">Contact Status Distribution</p>
              <BarChartComponent
                data={contactStats.map((stat: any) => ({
                  name: stat._id || 'Unknown',
                  value: stat.count || 0
                }))}
              />
            </div>

            {/* Monthly Growth */}
            <div className="flex-1 shadow-xl bg-white rounded-lg p-4">
              <p className="font-bold mb-4">Monthly Growth Trends</p>
              <AreaChartComponent />
            </div>
          </div>

          {/* Quick Stats Summary */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
              <h3 className="text-lg font-semibold">Active Projects</h3>
              <p className="text-2xl font-bold">{stats.activeProjects}</p>
              <p className="text-sm opacity-90">Currently running</p>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg">
              <h3 className="text-lg font-semibold">Featured Projects</h3>
              <p className="text-2xl font-bold">{stats.featuredProjects}</p>
              <p className="text-sm opacity-90">Highlighted projects</p>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg">
              <h3 className="text-lg font-semibold">Team Members</h3>
              <p className="text-2xl font-bold">{stats.totalTeams}</p>
              <p className="text-sm opacity-90">Total team members</p>
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-lg">
              <h3 className="text-lg font-semibold">Pending Contacts</h3>
              <p className="text-2xl font-bold">{stats.pendingContacts}</p>
              <p className="text-sm opacity-90">Awaiting response</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
