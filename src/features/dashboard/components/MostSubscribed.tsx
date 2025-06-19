// /components/ui/MostSubscribedChannels.tsx
import React from 'react';

interface Channel {
  name: string;
  subscribers: number;
  logo?: string;  // Optional: URL to the channel's logo
}

interface MostSubscribedChannelsProps {
  channels: Channel[];
}

const MostSubscribedChannels: React.FC<MostSubscribedChannelsProps> = ({ channels }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <span className='font-bold'>Most Popular Stream</span>
        <img src="/assets/download.png" alt="Channel Logo" className="w-6 h-6" /> {/* Placeholder logo */}
      </h3>
      <ul>
        {channels.map((channel, index) => (
          <li key={index} className="flex items-center justify-between mb-2 shadow-sm rounded-lg p-4 ">
            {channel.logo ? (
              <img src={channel.logo} alt={channel.name} className="w-8 h-8 rounded-full" />
            ) : (
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-white font-semibold">
                {channel.name[0]}
              </div>
            )}
            <span className="ml-2">{channel.name}</span>
            <span>{channel.subscribers}K</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MostSubscribedChannels;
