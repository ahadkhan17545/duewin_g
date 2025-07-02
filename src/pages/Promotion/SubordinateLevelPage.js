// /pages/SubordinateLevelPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import CommanHeader from '../../components/CommanHeader';

const SubordinateLevelPage = () => {
    const location = useLocation();
    const users = useState(location.state ?? []);
    return (
        <div className="bg-[#242424] min-h-screen w-full flex flex-col">
            <CommanHeader title='Subordinate Level List' />

            <div className="px-4 py-6 mt-[30px]">
                {
                    users[0]?.map((user, index) => (
                        <div
                            key={index}
                            className="bg-[#333332] rounded-lg p-3 mb-3 text-gray-400"
                        >
                            <div className="text-sm text-gray-400 mb-1">UID: {user?.user_id}</div>
                            <div className="flex justify-between text-sm py-1">
                                <span>Deposit:</span>
                                <span className="text-[#dd9138]">{user?.actual_deposit_amount ?? 0}</span>
                            </div>
                            <div className="flex justify-between text-sm py-1">
                                <span>Commission:</span>
                                <span className="text-[#dd9138]">{user?.commission_earned ?? 0}</span>
                            </div>
                            <div className="flex justify-between text-sm py-1">
                                <span>Joined:</span>
                                <span className="text-[#666462]">{user?.created_at?.split('T')[0]}</span>
                            </div>
                        </div>
                    ))
                }
            </div>




        </div>
    );

};

export default SubordinateLevelPage;
