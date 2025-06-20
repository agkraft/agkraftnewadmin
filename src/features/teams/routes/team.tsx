"use client";

import { useState, useEffect } from "react";
import { TeamDataTable } from "../components/table/data-table";
import { TeamType } from "../type/teamType";
import { getAllTeams } from "../components/api/api";
import { Loader } from "@/components/globalfiles/loader";
import { toast } from "react-toastify";
import { Users } from "lucide-react";

const TeamPage = () => {
  const [data, setData] = useState<TeamType[]>([]);
  const [loading, setLoading] = useState(true);
  const [page] = useState(0);
  const [limit] = useState(10);
  const [queryString] = useState("");

  const fetchTeams = async () => {
    setLoading(true);
    try {
      console.log("Fetching teams...");

      const result = await getAllTeams({
        page: page + 1,
        pageSize: limit,
        keyword: queryString,
      });

      if (result && (result.status || result.success) && result.data) {
        // Ensure we always set an array - API returns nested structure
        let teamData: TeamType[] = [];

        // Check for nested structure: result.data.data.teamMembers
        if (result.data.data && Array.isArray((result.data.data as any).teamMembers)) {
          teamData = (result.data.data as any).teamMembers;
        } else if (Array.isArray((result.data as any).teamMembers)) {
          teamData = (result.data as any).teamMembers;
        } else if (Array.isArray(result.data.data)) {
          teamData = result.data.data;
        } else if (Array.isArray(result.data)) {
          teamData = result.data;
        } else {
          teamData = [];
        }

        setData(teamData);
      } else {
        console.error("API error:", result?.error);
        // Don't show error toast if it's just empty data
        if (result?.error) {
          toast.error(result.error || "Failed to fetch teams");
        }
        setData([]);
      }
    } catch (error) {
      console.error("Failed to fetch teams:", error);
      toast.error("Failed to fetch teams. Please check if the backend is running.");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, [page, limit, queryString]);

  const handleRefresh = () => {
    fetchTeams();
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto py-6 px-4">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Users className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
        </div>
        <p className="text-gray-600">
          Manage your team members, their roles, and social media profiles.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Members</p>
              <p className="text-2xl font-bold text-gray-900">{Array.isArray(data) ? data.length : 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Members</p>
              <p className="text-2xl font-bold text-gray-900">
                {Array.isArray(data) ? data.filter(team => team.status === "active").length : 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <Users className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Inactive Members</p>
              <p className="text-2xl font-bold text-gray-900">
                {Array.isArray(data) ? data.filter(team => team.status === "inactive").length : 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Data Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6">
          <TeamDataTable
            data={data}
            loading={loading}
            onRefresh={handleRefresh}
          />
        </div>
      </div>
    </div>
  );
};

export default TeamPage;
