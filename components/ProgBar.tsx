import React, { useEffect, useRef, useState } from 'react';
import { Carousel } from 'primereact/carousel';
import { Dialog } from 'primereact/dialog';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { ProgressSpinner } from 'primereact/progressspinner';
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
import { useAccounts } from '@particle-network/btc-connectkit';
import { useWalletAddress } from './useWalletAddress';

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
  const { accounts } = useAccounts();

  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [dialogVisible, setDialogVisible] = useState<boolean>(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();

  const fetchData = async () => {
    try {
      const userAddress = address || 1;
      const response = await fetch(`https://api.palladiumlabs.org/sepolia/users/activities/${userAddress}`);
      // const response = await fetch(`https://api.palladiumlabs.org/sepolia/users/activities/0xEF4930f7059cEdD367A3F6A621264384668Ea05B`);

      const data = await response.json();
      if (!data || !data.task) {
        console.error("Data structure not as expected:", data);
        setError("We are recalibrating your points. Check back in some time for a surprise 😉.");
        return;
      }
      const taskArray = Object.entries(data.task).map(([name, task]: [string, any]) => ({
        name,
        rewardType: task.rewardType,
        rewardValue: task.rewardValue,
        status: task.status,
      }));

      setTasks(taskArray);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError("You have no activity. Open your first Trove and start collecting points.🫡");
    }
  };

  fetchData();

  useEffect(() => {
    if (isConnected && address) {
      fetchData();
    }
  }, [fetchData, isConnected, address, walletClient, ]);

  const handleLikeButtonClick = async (taskId: string) => {
    setIsLoading(taskId);
    try {
      await axios.put(`https://api.palladiumlabs.org/sepolia/users/activities/${address}/${taskId}`);
      // await axios.put(`https://api.palladiumlabs.org/sepolia/users/activities/0xEF4930f7059cEdD367A3F6A621264384668Ea05B/${taskId}`);
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
      <div className='w-full '>
        <button aria-label="Like button" onClick={handleClick} disabled={task.status === 'locked' || task.status === 'claimed'}>
          <div className="task-info gap-x-10  flex flex-col items-center">
            <p className=' body-text  font-semibold text-sm text-[#88e273]  text-clip break-words'>{task.name.replace(/_/g, ' ')}</p>
            <div className="md:w-[7rem] md:-ml-0 md:pb-0 pb-10">
              {isLoading === task.name ? (
                <div className="flex justify-center items-center w-full h-full">
                  <ProgressSpinner />
                </div>

              ) : (
                <>
                  {task.status === 'claimed' && task.rewardType === 'badge' && (
                    <div className='tooltip'>
                      <Image width={100} src={badge} alt="Badge" className="hover:cursor-grabbing" />
                      <span className="tooltiptext p-2 h-10 hover:cursor-grabbing">Reward has been claimed....✨</span>
                    </div>
                  )}
                  {task.status === 'claimed' && task.rewardType === 'point' && (
                    <div className='tooltip'>
                      <Image width={100} src={points} alt="Points" className="hover:cursor-grabbing" />
                      <span className="tooltiptext p-2 h-10 hover:cursor-grabbing">Reward has been claimed....✨</span>
                    </div>
                  )}
                  {task.status === 'unclaimed' && (
                    <div className="tooltip">
                      <Image width={100} src={unclaimed} alt="Unclaimed" />
                      <span className="tooltiptext">Click To Claim Reward✨</span>
                    </div>
                  )}
                  {task.status === 'locked' && (
                    <>
                      <Image width={105} src={locked} alt="Locked" className="hover:cursor-not-allowed" />
                      <div className='circle z-20' style={{ position: 'absolute' }}></div>
                    </>
                  )}
                </>
              )}
            </div>
            <div className='flex whitespace-nowrap'>
              {task.status !== 'locked' && (
                <>
                  <p className='capitalize body-text font-medium text-sm text-white hidden md:block '>{task.rewardValue} {task.rewardType === "point" ? "Points" : null}</p>
                </>
              )
              }
            </div>
          </div>
        </button>
      </div>
    );
  };

  return (
    <>
      {error ? (
        <p className='error-message w-full text-center items-center title-text hidden md:block'>{error}</p>
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

      <Dialog visible={dialogVisible} onHide={handleCloseDialog} className="w-fit bg-[#2d2a1c] p-4 rounded-md">
        {currentTask && (
          <>
            <h1 className="text-xl title-text2 mb-4 text-center">CONGRATULATIONS</h1>
            <div className="flex flex-col items-center mb-4">
              <Image width={100} src={currentTask.rewardType === 'badge' ? badge : points} alt="Reward" className="w-32 h-32" />
            </div>
            <div className="flex items-center justify-center gap-x-2 whitespace-nowrap mb-6">
              <div className="text-xl body-text text-[#88e273] capitalize">
                {currentTask.rewardValue}
              </div>
              <div className="text-lg body-text text-[#88e273] capitalize">
                {currentTask.rewardType}
              </div>
            </div>
            <div className="flex justify-center">
              <button onClick={handleCloseDialog} className="bg-yellow-500 body-text text-gray-900 font-medium py-2 px-6  hover:bg-yellow-600">
                Collect Now
              </button>
            </div>
          </>
        )}
      </Dialog>
    </>
  );
};

export default ProgBar;
