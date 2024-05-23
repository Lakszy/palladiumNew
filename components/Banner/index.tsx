"use client"

import React, { useState, useEffect } from 'react';
import "../../app/App.css"

const Banner: React.FC = () => {
    const [showBanner, setShowBanner] = useState<boolean>(true);

    // useEffect(() => {
    //     const isBannerClosed = localStorage.getItem('isBannerClosed');
    //     if (isBannerClosed === 'true') {
    //         setShowBanner(false);
    //     }
    // }, []);

    const handleCloseBanner = () => {
        setShowBanner(false);
    };

    return (
        <>
            {showBanner && (
                <>
                    <div className='bg-yellow-300 h-12 '>
                        <div className="flexBanner">
                            <div className='mobile-banner-text redHatFont fnt_wgt_500 flexT'>

                                <div>
                                    <span className='whitespace-nowrap  title-text text-2xl bckgrnd_img_card_fnt mobile-banner-text text-wrap'>
                                    We are currently experiencing network issues. The testnet will be live soon.
                                        <span className='ml-05'>
                                            <a href="https://discord.com/invite/9MMEyJ4JDz"
                                                target='_blank' rel="noreferrer" className='bckgrnd_img_card_fnt whitespace-nowrap text-lg custom-link'>Learn More</a>
                                        </span>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="close-icon" onClick={handleCloseBanner}>
                            <span className='crsr_pntr fnt_wgt_800 txtBlack'>&times;</span>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default Banner;
