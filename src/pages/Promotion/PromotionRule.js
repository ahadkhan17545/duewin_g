import React, { useState, useEffect } from "react";
import PromotionRuleheader from "../../components/PromotionRuleHeader";
import Crown from "../../Assets/crown.png";



function PromotionRule() {
  const data = [
    { level: "L0", number: 0, betting: 0, deposit: 0 },
    { level: "L1", number: "500K", betting: "100K", deposit: "20K" },
    { level: "L2", number: "1000K", betting: "200K", deposit: "40K" },
    { level: "L3", number: "2.50M", betting: "500K", deposit: "100K" },
    { level: "L4", number: "3.50M", betting: "700K", deposit: "140K" },
    { level: "L5", number: "5M", betting: "1,000K", deposit: "200K" },
    { level: "L6", number: "10M", betting: "2M", deposit: "400K" },
    { level: "L7", number: "100M", betting: "20M", deposit: "4M" },
    { level: "L8", number: "500M", betting: "100M", deposit: "20M" },
    { level: "L9", number: "1,000M", betting: "200M", deposit: "40M" },
    { level: "L10", number: "1,500M", betting: "300M", deposit: "60M" },
  ];
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []); 

  return (
    <div className="bg-[#242424] min-h-screen w-full flex flex-col">
      <PromotionRuleheader className="z-100" />
      <div className="bg-[#242424] min-h-screen flex flex-col items-center justify-center mt-10">
        <div className="w-full bg-[#242424] p-4 font-sans text-sm">
          <div className="flex flex-col items-center text-center">
            <header className="flex items-center text-lg font-bold justify-center">
              <span className="text-[#d9ac4f]">
                【Promotion partner】program
              </span>
            </header>

            <p className="text-[#a8a5a1] font-semibold text-sm mb-6">
              This activity is valid for a long time
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                number: "01",
                text: "There are 6 subordinate levels in inviting friends, if A invites B, then B is a level 1 subordinate of A. If B invites C, then C is a level 1 subordinate of B and also a level 2 subordinate of A. If C invites D, then D is a level 1 subordinate of C, at the same time a level 2 subordinate of B and also a level 3 subordinate of A.",
              },
              {
                number: "02",
                text: "When inviting friends to register, you must send the invitation link provided or enter the invitation code manually so that your friends become your level 1 subordinates.",
              },
              {
                number: "03",
                text: "The invitee registers via the inviter's invitation code and completes the deposit, shortly after that the commission will be received immediately",
              },
              {
                number: "04",
                text: "The calculation of yesterday's commission starts every morning at 01:00. After the commission calculation is completed, the commission is rewarded to the wallet and can be viewed through the commission collection record.",
              },
              {
                number: "05",
                text: `Commission rates vary depending on your agency level on that day.
    Number of Teams: How many downline deposits you have to date.
    Team Deposits: The total number of deposits made by your downline in one day.`,
              },
            ].map((item, index) => (
              <div key={index} className="bg-[#333332] rounded-xl px-4 pb-4">
                <div className="flex justify-center items-center">
                  <div
                    className="bg-[#3a3947] w-52 text-center py-1 mb-4 text-white"
                    style={{
                      borderTopLeftRadius: "60px 0px",
                      borderBottomLeftRadius: "80px 80px",
                      borderTopRightRadius: "60px 0px",
                      borderBottomRightRadius: "80px 80px",
                    }}
                  >
                    {item.number}
                  </div>
                </div>

                <p className="text-[#a8a5a1] leading-relaxed">{item.text}</p>
              </div>
            ))}

            <div className="flex justify-center">
              <div className="w-full rounded-lg">
                <div className="grid grid-cols-4 py-4 font-bold bg-[#3a3947] rounded-tr-lg rounded-tl-lg text-gray-300 text-xs">
                  <div className="text-center">Rebate level</div>
                  <div className="text-center">Team Number</div>
                  <div className="text-center">Team Betting</div>
                  <div className="text-center">Team Deposit</div>
                </div>

                {data.map((row, index) => (
                  <div
                    key={index}
                    className={`grid grid-cols-4 py-2 text-[#a8a5a1] px-2 text-sm transition-colors 
                    ${index % 2 === 0 ? "bg-[#333332]" : "bg-[#2a2a3333]"}`}
                  >
                    <div className="flex items-center gap-1 relative">
                      {/* Crown Image */}
                      <div className="relative">
                        <img
                          src={Crown}
                          alt="Crown Icon"
                          className="ml-2 w-14 h-6"
                        />
                        <span className="absolute inset-0 flex items-center justify-center text-xs text-[#fffba9] ml-8 mt-2">
                          {row.level}
                        </span>
                      </div>
                    </div>

                    <div className="text-center">{row.number}</div>
                    <div className="text-center">{row.betting}</div>
                    <div className="text-center">{row.deposit}</div>
                  </div>
                ))}
              </div>
            </div>

            {[
              {
                number: "06",
                text: "The commission percentage depends on the membership level. The higher the membership level, the higher the bonus percentage. Different game types also have different payout percentages.",
              },
              {
                number: "07",
                text: "TOP20 commission rankings will be randomly awarded with a separate bonus",
              },
              {
                number: "08",
                text: "The final interpretation of this activity belongs to Welcome to BDG Game",
              },
            ].map((item, index) => (
              <div key={index} className="bg-[#333332] rounded-xl px-4 pb-4">
                <div className="flex justify-center items-center">
                  <div
                    className="bg-[#3a3947] w-52 text-center py-1 mb-4 text-white"
                    style={{
                      borderTopLeftRadius: "60px 0px",
                      borderBottomLeftRadius: "80px 80px",
                      borderTopRightRadius: "60px 0px",
                      borderBottomRightRadius: "80px 80px",
                    }}
                  >
                    {item.number}
                  </div>
                </div>

                <p className="text-[#a8a5a1] leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PromotionRule;