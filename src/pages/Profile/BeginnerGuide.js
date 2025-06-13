import React from "react";
import NotificationServiceHeader from "../../components/NotificationServiceHeader";
import GuideImage from "../../Assets/Guide1.png"; // Import your image
import GuideImage2 from "../../Assets/Guide2.png"; // Import your image
import GuideImage3 from "../../Assets/Guide3.png"; // Import your image
import GuideImage4 from "../../Assets/Guide4.png"; // Import your image
import GuideImage5 from "../../Assets/Guide5.png";
import GuideImage6 from "../../Assets/Guide6.png";
import GuideImage7 from "../../Assets/Guide7.png";
import GuideImage8 from "../../Assets/Guide8.png";
import GuideImage9 from "../../Assets/Guide9.png";
import GuideImage10 from "../../Assets/Guide10.png";
import BeginnerGuideHeader from "../../components/BeginnerGuideHeader";

function BeginnersGuide() {
  return (
    <div className="bg-[#242424] w-full min-h-screen flex flex-col">
      <BeginnerGuideHeader />

      <div className="px-4 py-6 mt-8 text-sm text-[#a8a5a1]">
        {/* Paragraph */}
        <p className="text-lg leading-relaxed text-sm mb-4">
          Set your own password(6 Letters)
        </p>

        {/* Image */}
        <img
          src={GuideImage}
          alt="Guide Illustration"
          className="w-full rounded-lg shadow-md"
        />

        {/* Image */}
        <img
          src={GuideImage2}
          alt="Guide Illustration"
          className="w-full rounded-lg shadow-md mt-10"
        />

        <p className="text-lg leading-relaxed text-sm mb-4 mt-4">
          -Make sure your total bet is zero(0)
        </p>

        {/* Image */}
        <img
          src={GuideImage3}
          alt="Guide Illustration"
          className="w-full rounded-lg shadow-md"
        />

        <p className="text-lg leading-relaxed text-sm mb-4 mt-4">
          -You can click wallet, then you can choose the recharge/withdraw to
          check your own transaction history
        </p>

        {/* Image */}
        <img
          src={GuideImage4}
          alt="Guide Illustration"
          className="w-full rounded-lg shadow-md"
        />

        {/* Image */}
        <img
          src={GuideImage5}
          alt="Guide Illustration"
          className="w-full rounded-lg shadow-md mt-10"
        />

        <p className="text-lg leading-relaxed text-sm mb-4 mt-4">
          Your can click the promote to create your personal promotional link to
          invite your friend to join our platform, if you invite friend and your
          friend have place each betting, you will automatically get a
          commission of 0.3%- 1% from system, for example " If your friends who
          invited bu you today total bet on Lottery 10000 rupees, then you will
          get a contribution which will directly automatic credit to your
          account balance in the next day on 1:00 AM and it will be continue
          when your friend continue bet on everyday
        </p>

        {/* Image */}
        <img
          src={GuideImage6}
          alt="Guide Illustration"
          className="w-full rounded-lg shadow-md"
        />

<p className="text-lg leading-relaxed text-sm mb-4 mt-4">
          -You can reset your password when you forget the password<br/>
          -When you click the otp, you will receive a SMS about verification computed<br/>
          -Click Submit
        </p>

        {/* Image */}
        <img
          src={GuideImage7}
          alt="Guide Illustration"
          className="w-full rounded-lg shadow-md"
        />

<p className="text-lg leading-relaxed text-sm mb-4 mt-4">
Click the download app to download the app and it is easily to use
        </p>

        {/* Image */}
        <img
          src={GuideImage8}
          alt="Guide Illustration"
          className="w-full rounded-lg shadow-md"
        />

<p className="text-lg leading-relaxed text-sm mb-4 mt-4">
If you have some complaints and suggestion, you can click customer service to feedback, our customer service will priority to solve it.
        </p>

        {/* Image */}
        <img
          src={GuideImage9}
          alt="Guide Illustration"
          className="w-full rounded-lg shadow-md"
        />



        {/* Image */}
        <img
          src={GuideImage10}
          alt="Guide Illustration"
          className="w-full rounded-lg shadow-md mt-8"
        />
      </div>
    </div>
  );
}

export default BeginnersGuide;
