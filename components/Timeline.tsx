import React from 'react';
import { Timeline } from 'primereact/timeline';
import Image from 'next/image';
import statusCrateUnlocked from "../app/assets/images/statusCrateUnlocked.svg"
import statusCrateLocked from "../app/assets/images/statusCrateLocked.svg"
import statusRobo from "../app/assets/images/statusRobo.svg"
import statusUnclaimed from "../app/assets/images/statusUnclaimed.svg"
import statusCoin from "../app/assets/images/statusCoin.svg"

import "./TimelineN.css"

interface OppositeDemoProps {
    badges: {
        troveMaster: "claimed" | "unclaimed";
        "2000Points": "claimed" | "unclaimed";
        badge3: "claimed" | "unclaimed" | "locked";
        badge4: "claimed" | "unclaimed" | "locked";
    };
}

const OppositeDemo: React.FC<OppositeDemoProps> = ({ badges }) => {
    const getBadgeImage = (date: string, status: "claimed" | "unclaimed" | "locked") => {
        switch(date) {
            case "troveMaster":
                return status === "claimed" ? statusRobo : status === "unclaimed" ? statusUnclaimed : statusCrateLocked;
            case "2000Points":
                return status === "claimed" ? statusCoin : status === "unclaimed" ? statusUnclaimed : statusCrateLocked;
            case "badge3":
            case "badge4":
                return status === "claimed" ? statusCrateUnlocked : status === "unclaimed" ? statusUnclaimed : statusCrateLocked;
            default:
                return null;
        }
    };

    const events = Object.entries(badges).map(([badge, status]) => ({
        date: badge,
        status
    }));

    return (
        <div className="timeline-container">
            <div className="images-timeline -mt-2">
                {events.map((item) => (
                    <div key={item.date} className="image-item">
                        <Image src={getBadgeImage(item.date, item.status)} alt="badge" width={70} height={20} />
                        <div className='text-white font-mono font-bold '>{item.date}</div>
                    </div>
                ))}
            </div>
            <Timeline value={events} layout="horizontal" align="top" />
        </div>
    )
}

export default OppositeDemo;
