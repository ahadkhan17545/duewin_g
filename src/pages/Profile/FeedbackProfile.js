import React from "react";
import FeedbackHistory from "../../components/FeedbackHeader";
import feedback from "../../Assets/finalicons/feedback.png";

const FeedbackProfile = () => {
  return (
    <div className="flex flex-col items-center w-full bg-[#242424] text-white min-h-screen py-6">
      {/* Header */}
      <FeedbackHistory />

      {/* Feedback Box */}
      <div className="bg-[#333332] text-[#c2c2c2] p-4 w-full h-80 rounded-lg shadow-md mt-8">
        <p className="text-sm">
          Welcome to feedback, please give feedback - please describe the problem in
          detail when providing feedback, preferably attach a screenshot of the
          problem you encountered, we will immediately process your feedback!
        </p>
      </div>
      <div className="mt-10 text-center text-base text-white">
        <p className="mb-1 cursor-pointer hover:underline">
          Send helpful feedback
        </p>
        <p className="cursor-pointer ">
          Chance to win Mystery Rewards
        </p>
      </div>

      {/* Feedback Image */}
      <div className="mt-6">
        <img src={feedback} alt="Feedback" className="w-64 h-64 object-contain" />
      </div>

      {/* Submit Button */}
      <button
  className="mt-4 w-[90%] px-6 py-2 rounded-full text-xl  text-[#8f5206] shadow-md 
  bg-[linear-gradient(90deg,_#FAE59F_0%,_#C4933F_100%)] hover:opacity-90 transition duration-300"
>
  Submit 
</button>



   
      
    </div>
  );
};

export default FeedbackProfile;
