import React from "react";
import GameRulesHeader from "../../components/GameRulesHeader";

const InviteBonusTable = () => {
  // Table data with headers and rows
  const headers = ["Invite account", "Deposit amount", "Bonus"];
  const rows = [
    { people: "1People", depositAmount: "₹300.00", bonus: "₹65.00" },
    { people: "3People", depositAmount: "₹300.00", bonus: "₹185.00" },
    { people: "10People", depositAmount: "₹300.00", bonus: "₹650.00" },
    { people: "30People", depositAmount: "₹300.00", bonus: "₹1,850.00" },
    { people: "60People", depositAmount: "₹300.00", bonus: "₹3,550.00" },
    { people: "100People", depositAmount: "₹300.00", bonus: "₹6,550.00" },
    { people: "200People", depositAmount: "₹300.00", bonus: "₹13,050.00" },
    { people: "500People", depositAmount: "₹300.00", bonus: "₹32,325.00" },
    { people: "1000People", depositAmount: "₹300.00", bonus: "₹65,995.00" },
    { people: "5000People", depositAmount: "₹300.00", bonus: "₹402,975.00" },
    { people: "10000People", depositAmount: "₹300.00", bonus: "₹810,955.00" },
    { people: "20000People", depositAmount: "₹300.00", bonus: "₹1,721,915.00" },
    { people: "50000People", depositAmount: "₹300.00", bonus: "₹3,804,785.00" },
  ];

  // Rules data
  const rules = [
    "Only when the number of invited accounts is reached and each account can meet the recharge amount can you receive the bonus.",
    "The invitation account meets the requirements, but the recharge amount of the account does not meet the requirements, and the bonus cannot be claimed.",
    "Please claim the event bonus within the event period. All bonuses will be cleared after the event expires.",
    "Please complete the task within the event period. After the event expires, the invitation record will be cleared.",
  ];

  return (
    <div className="bg-[#242424] min-h-screen w-full flex flex-col items-center justify-center p-4 font-serif">
      <GameRulesHeader />
      <div className="w-full max-w-md mx-auto mt-10">
        {/* Info section */}
        <div className="w-full mb-4">
          <p className="text-[#b89d7a] text-sm">
            Invite friends and recharge to get additional platform rewards!
          </p>
          <p className="text-[#a8a5a1] text-xs sm:text-sm mt-2">
            After being claimed, the rewards will be directly distributed to the
            wallet balance within 10 minutes.
          </p>
        </div>

        {/* Invite Bonus Table Container */}
        <div className="bg-gray-800 rounded-lg overflow-hidden w-full mb-8">
          <table className="w-full border-collapse table-fixed">
            {/* Table headers */}
            <thead className="bg-[#3a3947] text-center border-b border-black">
              <tr>
                {headers.map((header, index) => (
                  <th
                    key={index}
                    className="py-3 px-2 text-sm sm:text-sm font-medium text-white"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            {/* Table body */}
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={
                    rowIndex % 2 === 0 ? "bg-[#333332]" : "bg-[#282730]"
                  }
                >
                  <td className="py-3 px-2 text-center text-[#a8a5a1] text-lg  font-sans">
                    {row.people}
                  </td>
                  <td className="py-3 px-2 text-center text-[#a8a5a1] text-lg">
                    <span className="font-sans">{row.depositAmount}</span>
                  </td>
                  <td className="py-3 px-2 text-center text-[#a8a5a1] text-lg ">
                    <span className="font-sans">{row.bonus}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Rules Section - Separated */}
        <div className="bg-gray-800 rounded-lg overflow-hidden w-full">
          {/* Rules Header with Simple Curved Design */}

          {/* Rules list */}
          <div className="bg-[#333332]">
            <div
              className="bg-[#3a3947] text-white py-4 px-4 text-center relative"
              style={{
                borderRadius: "7px 8px 50% 50% / 8px 8px 20px 20px",
                width: '240px',
    margin: 'auto';
    height: 30px;
              }}
            >
              <h2 className="text-lg font-medium">Rules</h2>
            </div>
            <ul className="space-y-3">
              {rules.map((rule, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-amber-500 mr-2 flex-shrink-0 mt-1">
                    ◆
                  </span>
                  <span className="text-sm text-[#a8a5a1] leading-relaxed">
                    {rule}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteBonusTable;
