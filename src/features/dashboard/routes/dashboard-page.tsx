// /pages/DashboardPage.tsx
import React from "react";
import CardComponent from "../components/card";
import { cardData } from "../data/card-data";
import LineChart from "../components/chart";
import MostSubscribedChannels from "../components/MostSubscribed";
import { BarChartComponent } from "../components/bar-graph";
import { AreaChartComponent } from "../components/area-chart";

const DashboardPage: React.FC = () => {
  const channels = [
    { name: "Channel 1", subscribers: 120, logo: "" },
    { name: "Channel 2", subscribers: 95, logo: "" },
    { name: "Channel 3", subscribers: 80, logo: "" },
    { name: "Channel 4", subscribers: 75, logo: "" },
    { name: "Channel 5", subscribers: 60, logo: "" },
  ];

  // const barData = [
  //   { name: 'Jan', value: 400 },
  //   { name: 'Feb', value: 300 },
  //   { name: 'Mar', value: 450 },
  //   { name: 'Apr', value: 200 },
  //   { name: 'May', value: 350 },
  //   { name: 'Jun', value: 500 },
  // ];

  return (
    <div className="flex h-screen w-full">
      <div className="flex flex-col flex-grow">
        <main className="p-6 flex-grow overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
            {cardData.map((card, index) => (
              <CardComponent
                key={index}
                title={card.title}
                count={card.count}
                bgImage={card.bgImage}
              />
            ))}
          </div>
          <div className="mt-6 flex gap-2">
            <div className="flex-1 shadow-xl bg-white rounded-lg p-4">
              <p className="font-bold mb-4">User Statistics Overview</p>
              <LineChart />
            </div>
            <div className="ml-14 mt-0 flex-1">
              <MostSubscribedChannels channels={channels} />
            </div>
          </div>
          <div className="mt-6 flex flex-col lg:flex-row gap-6">
            {/* Earning Reports */}
            <div className="flex-1 shadow-xl bg-white rounded-lg p-4">
              <p className="font-bold mb-4">Earning Reports</p>
              <BarChartComponent />
            </div>

            {/* Total Accounts */}
            <div className="flex-1 shadow-xl bg-white rounded-lg p-4">
              <p className="font-bold mb-4">Total Accounts</p>
              <AreaChartComponent />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
