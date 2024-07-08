import React, { useEffect, useRef, useState } from 'react';
import { Carousel } from 'primereact/carousel';
import { Dialog } from 'primereact/dialog';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Messages } from 'primereact/messages';
import Image from 'next/image';
import points from "../app/assets/images/Points.png";
import unclaimed from "../app/assets/images/unclaimed.png";
import locked from "../app/assets/images/Locked.png";
import badge from "../app/assets/images/bbadge.png";
import axios from 'axios';
import "./Prog.css";
import "../app/App.css"
import { useAccount, useWalletClient } from 'wagmi';

interface Task {
  name: string;
  rewardType: string;
  rewardValue: string | number;
  status: string;
}

const ProgBar: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const [error, setError] = useState<string | null>(null);
  const msgs = useRef<Messages>(null);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [dialogVisible, setDialogVisible] = useState<boolean>(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();

  const fetchData = async () => {
    try {
      const response = await fetch(`https://api.palladiumlabs.org/users/activities/${address}`);
      if (!response.ok) {
        setError("We are recalibrating your points. Check back in some time for a surprise 😉.");
        return;
      }
      const data = await response.json();
      const taskArray = Object.entries(data.task).map(([name, task]: [string, any]) => ({
        name,
        rewardType: task.rewardType,
        rewardValue: task.rewardValue,
        status: task.status,
      }));
      setTasks(taskArray);
    } catch (error) {
      setError("You have no activity. Open your first trove and start collecting points.🫡");
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
  if (isConnected && address) {
    fetchData();
  }
  }, [isConnected, address, walletClient]);

  const handleLikeButtonClick = async (taskId: string) => {
    setIsLoading(taskId);
    try {
      await axios.put(`https://api.palladiumlabs.org/users/activities/${address}/${taskId}`);
      fetchData();
      const task = tasks.find((task) => task.name === taskId);
      if (task) {
        setCurrentTask(task);
        setDialogVisible(true);
      }
    } catch (error) {
      setError("We are recalibrating your points. Check back in some time for a surprise 😉....");
      console.error('Error making PUT request:', error);
    } finally {
      setIsLoading(null);
    }
  };
  const handleCloseDialog = () => {
    setDialogVisible(false);
    setCurrentTask(null);
  };

  const itemTemplate = (task: Task) => {
    const handleClick = task.status === 'locked' || task.status === 'claimed' ? undefined : () => handleLikeButtonClick(task.name);
    return (
      <div className='w-full'>
        <button aria-label="Like button" onClick={handleClick} disabled={task.status === 'locked' || task.status === 'claimed'}>
          <div className="task-info gap-x-10 flex flex-col items-center">
            <p className=' body-text  font-semibold text-sm text-yellow-300  text-clip break-words'>{task.name.replace(/_/g, ' ')}</p>
            <div className="w-[10rem]  -ml-10 md:-ml-0 md:w-[7rem] md:p-0 p-8">
          {isLoading === task.name ? (
            <div className="text-left -mt-6 w-full h-2">
              <div className="hex-loader"></div>
            </div>
          ) : (
            <>
              {task.status === 'claimed' && task.rewardType === 'badge' && (
                  <div className='tooltip'>
                    <Image  width={100} src={badge} alt="Badge" className="hover:cursor-grabbing" />
                    <span className="tooltiptext p-2 h-10 hover:cursor-grabbing">Reward has been claimed....✨</span>
                  </div>
              )}
              {task.status === 'claimed' && task.rewardType === 'point' && (
                  <div className='tooltip'>
                    <Image  width={100} src={points} alt="Points" className="hover:cursor-grabbing" />
                    <span className="tooltiptext p-2 h-10 hover:cursor-grabbing">Reward has been claimed....✨</span>
                  </div>
              )}
              {task.status === 'unclaimed' && (
                <div className="tooltip">
                  <Image  width={100} src={unclaimed} alt="Unclaimed" />
                  <span className="tooltiptext">Click To Claim Reward✨</span>
                </div>
              )}
              {task.status === 'locked' && (
                <>
                  <Image  width={100} src={locked} alt="Locked" className="hover:cursor-not-allowed" />
                  <div className='circle z-20' style={{ position: 'absolute',  transform: 'translate(-50%, -50%)' }}></div>
                </>
              )}
                </>
              )}
            </div>
            <div className='flex whitespace-nowrap'>
              <p className='capitalize body-text font-medium text-sm text-white notMobileDevice '>{task.rewardValue} {task.rewardType === "point" ? "Points" : null}</p>
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

      <Dialog visible={dialogVisible} onHide={handleCloseDialog} className="w-fit bg-[#2d2a1c]">
        {currentTask && (
          <div className="p-8 bg-[#2d2a1c] rounded-lg shadow-lg">
            <h1 className="text-2xl title-text mb-4">CONGRATULATIONS</h1>
            <div className="flex justify-center mb-4">
              <Image  width={100} src={currentTask.rewardType === 'badge' ? badge : points} alt="Reward" className="w-32 h-32" />
            </div>
            <div className="text-2xl title-text text-yellow-300 font-bold mb-2">{currentTask.rewardValue}</div>
            <div className="text-lg title-text text-yellow-300 mb-6 capitalize">{currentTask.rewardType}</div>
            <button onClick={handleCloseDialog} className="bg-yellow-500 title-text text-gray-900 font-bold py-2 px-6 rounded hover:bg-yellow-600">
              COLLECT NOW
            </button>
          </div>
        )}
      </Dialog>
    </>
  );
};

export default ProgBar;
