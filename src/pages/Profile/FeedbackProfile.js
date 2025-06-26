import React, { useEffect, useState } from "react";
import feedback from "../../Assets/finalicons/feedback.png";
import CommanHeader from "../../components/CommanHeader";
import apiServices from "../../api/apiServices";

const FeedbackProfile = () => {
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackHistory, setFeedbackHistory] = useState([]);
  useEffect(() => {
    fetchFeedbackHistory();
  }, []);
  const fetchFeedbackHistory = async () => {
    try {
      const data = await apiServices.getFeedbacks();
      if (Array.isArray(data?.data)) {
        setFeedbackHistory(data?.data?.slice(0,4));
      }
    } catch (err) {
      console.error("Failed to fetch feedback history:", err);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!feedbackText.trim()) return alert("Please enter some feedback!");
    let payload = {
      content: feedbackText
    }
    let data = await apiServices.addFeedback(payload)
    if (data?.success) {

      setFeedbackText("");
      fetchFeedbackHistory()
    }
  };

  return (
    <div className="flex flex-col items-center w-full bg-[#242424] text-white min-h-screen py-6">
      {/* Header */}
      <CommanHeader title="Feedback" />

      {/* Feedback Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-[#333332] text-[#c2c2c2] p-4 w-[90%] max-w-md rounded-lg shadow-md mt-8"
      >
        <label htmlFor="feedback" className="text-sm font-medium mb-2 block">
          Your Feedback
        </label>
        <textarea
          id="feedback"
          value={feedbackText}
          onChange={(e) => setFeedbackText(e.target.value)}
          rows={5}
          placeholder="Write something helpful..."
          className="w-full p-3 rounded-md bg-[#242424] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#C4933F] resize-none"
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="mt-4 w-full px-6 py-2 rounded-full text-xl text-[#8f5206] 
            shadow-md bg-[linear-gradient(90deg,_#FAE59F_0%,_#C4933F_100%)] 
            hover:opacity-90 transition duration-300"
        >
          Submit
        </button>
      </form>
      {feedbackHistory.length > 0 && (
        <div className="w-[90%] max-w-md mt-6 bg-[#333332] p-4 rounded-lg shadow-inner">
          <h3 className="text-lg font-semibold text-white mb-3">Your Feedback History</h3>
          <ul className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {feedbackHistory.map((item) => (
              <li key={item.id} className="border-b border-[#555] pb-2">
                <p className="text-sm text-[#eaeaea]">{item.content}</p>
                <span className="text-xs text-gray-400">
                  {new Date(item.created_at).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Message Area */}
      <div className="mt-10 text-center text-base text-white">
        <p className="mb-1 cursor-pointer hover:underline">
          Send helpful feedback
        </p>
        <p className="cursor-pointer">
          Chance to win Mystery Rewards
        </p>
      </div>

      {/* Feedback Image */}
      <div className="mt-6">
        <img
          src={feedback}
          alt="Feedback"
          className="w-64 h-64 object-contain"
        />
      </div>
    </div>
  );
};

export default FeedbackProfile;
