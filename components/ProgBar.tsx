import React, { useEffect, useRef, useState } from 'react';
import { Carousel } from 'primereact/carousel';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Messages } from 'primereact/messages';
import Image from 'next/image';
import points from "../app/assets/images/Points.png";
import unclaimed from "../app/assets/images/unclaimed.png";
import locked from "../app/assets/images/Locked.png";
import badge from "../app/assets/images/Badge.png";
import axios from 'axios';
import "./Prog.css";
import "../app/App.css"
import { useAccount } from 'wagmi';
interface Task {
  name: string;
  rewardType: string;
  rewardValue: string | number;
  status: string;
}

const TaskScroll: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);
  const msgs = useRef<Messages>(null);
  const { address, isConnected } = useAccount();


  const fetchData = async () => {
    try {
      const response = await fetch(`https://api.palladiumlabs.org/users/activities/${address}`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      const taskArray = Object.entries(data.tasks).map(([name, task]: [string, any]) => ({
        name,
        rewardType: task.rewardType,
        rewardValue: task.rewardValue,
        status: task.status,
      }));
      setTasks(taskArray);
    } catch (error) {
      setError("We are recalibrating your points. Check back in some time for a surprise 😉....");
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLikeButtonClick = async (taskId: string) => {
    try {
      await axios.put(`https://api.palladiumlabs.org/users/activities/${address}/${taskId}`);
      fetchData();
    } catch (error) {
      setError("We are recalibrating your points. Check back in some time for a surprise 😉....");
      console.error('Error making PUT request:', error);
    }
  };

  const itemTemplate = (task: Task) => {
    const handleClick = task.status === 'locked' || task.status === 'claimed' ? undefined : () => handleLikeButtonClick(task.name);
    return (
      <div className='w-full'>
        <button aria-label="Like button" onClick={handleClick} disabled={task.status === 'locked' || task.status === 'claimed'}>
          <div className="task-info gap-x-10 flex flex-col items-center">
            <p className='title-text text-yellow-300  text-clip break-words'>{task.name.replace(/_/g, ' ')}</p>
            <div className="w-[10rem] md:w-[7rem] md:p-0 p-8">
              {task.status === 'claimed' && task.rewardType === 'badge' && (
                <>
                  <Image src={badge} alt="Badge" className="hover:cursor-not-allowed" />
                </>
              )}
              {task.status === 'claimed' && task.rewardType === 'point' && (
                <>
                  <Image src={points} alt="Points" className="hover:cursor-not-allowed" />
                </>
              )}
              {task.status === 'unclaimed' && (
                <div className="tooltip">
                  <Image src={unclaimed} alt="Unclaimed" />
                  <span className="tooltiptext">Click To Claim Reward✨</span>
                </div>
              )}
              {task.status === 'locked' && (
                <>
                  <Image src={locked} alt="Locked" className="hover:cursor-not-allowed" />
                  <div className='circle z-20' style={{ position: 'absolute', top: '62%', left: '50%', transform: 'translate(-50%, -50%)' }}></div>
                </>
              )}
            </div>
            <div className='flex whitespace-nowrap'>
              <p className='title-text text-yellow-300 mr-1 notMobileDevice '>{task.rewardValue} {task.rewardType === "point" ? "Points" : null}</p>
            </div>
          </div>
        </button>
      </div>
    );
  };

  return (
    <>
      {error ? (
        <p className='error-message w-full text-center items-center title-text notMobileDevice'>{error}</p>
      ) : tasks.length === 0 ? (
        <Messages ref={msgs} />
      ) : (
        <Carousel value={tasks} itemTemplate={itemTemplate} numVisible={4} numScroll={1} responsiveOptions={[
          {
            breakpoint: '1024px',
            numVisible: 3,
            numScroll: 1
          },
          {
            breakpoint: '768px',
            numVisible: 2,
            numScroll: 1
          },
          {
            breakpoint: '560px',
            numVisible: 1,
            numScroll: 1
          }
        ]} />
      )}
    </>
  );
};

export default TaskScroll;
