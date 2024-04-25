import React, { useEffect, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Image from 'next/image';
import points from "../app/assets/images/Points.png";
import unclaimed from "../app/assets/images/unclaimed.png";
import locked from "../app/assets/images/Locked.png";
import badge from "../app/assets/images/Badge.png";
import axios from 'axios';
import "./Prog.css";

interface Task {
  name: string;
  rewardType: string;
  rewardValue: string | number;
  status: string;
}

const TaskScroll: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchData = async () => {
    try {
      const response = await fetch('https://api.palladiumlabs.org/users/activities/0x6c47dcbe1985b717488a2aa6aeed209618d93c5');
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
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLikeButtonClick = async (taskId: string) => {
    try {
      await axios.put(`https://api.palladiumlabs.org/users/activities/0x6c47dcbe1985b717488a2aa6aeed209618d93c5/${taskId}`);
      
      fetchData();
    } catch (error) {
      console.error('Error making PUT request:', error);
    }
  };

  return (
    <>
      <Carousel showStatus={false} showThumbs={false} showIndicators={false} showArrows={true} centerMode={true} centerSlidePercentage={100 / 4}>
        {tasks.map((task, index) => (
          <div key={task.name} >
            {index > 0 && <div className="connector" />}
            <a key={task.name} href="#" onClick={(e) => { e.preventDefault(); handleLikeButtonClick(task.name); }}>
              <div className="task-info gap-x-10 flex flex-col items-center">
                <p className='title-text text-yellow-300  text-clip break-words'>{task.name.replace(/_/g, ' ')}</p>
                <div className="w-[10rem] md:w-[7rem] md:p-0 p-8">
                  {task.status === 'claimed' && task.rewardType === 'badge' && (
                    <>
                      <Image src={badge} alt="Badge" />
                    </>
                  )}
                  {task.status === 'claimed' && task.rewardType === 'point' && (
                    <>
                      <Image src={points} alt="Points" />
                    </>
                  )}
                  {task.status === 'unclaimed' && (
                    <>
                      <Image src={unclaimed} alt="Unclaimed" />
                    </>
                  )}
                  {task.status === 'locked' && (
                    <>
                      <Image src={locked} alt="Locked" />
                      <div className='circle z-20' style={{ position: 'absolute', top: '62%', left: '50%', transform: 'translate(-50%, -50%)' }}></div>
                    </>
                  )}
                </div>
                <div className='flex whitespace-nowrap'>
                  <p className='title-text text-yellow-300 mr-1 notMobileDevice '>{task.rewardValue} {task.rewardType === "point" ? "Points" : null}</p>
                </div>
              </div>
            </a>
            {index < tasks.length - 1 && <div className="connector" />}
          </div>
        ))}
      </Carousel>
    </>
  );
};

export default TaskScroll;
