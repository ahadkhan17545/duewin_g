const BASE_URL = "https://api.strikecolor1.com/api";

// Helper function to get the auth token
const getAuthToken = () => {
  // Retrieve token from localStorage (set by auth.js)
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("No auth token found in localStorage");
    throw new Error("No auth token found. Please log in again.");
  }

  // Debug: Log the token (remove in production)
  console.log("Raw token from localStorage:", token);

  // Check if token already has 'Bearer ' prefix
  const bearerToken = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
  return bearerToken;
};

export const transferFromThirdParty = async () => {
  try {
    const token = localStorage.getItem("authToken"); // Adjust based on your auth implementation
    const response = await fetch(
      "https://api.strikecolor1.com/api/wallet/transfer-from-third-party",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Adjust based on your auth implementation
        },
        body: JSON.stringify({
          // Add any required parameters here based on your API documentation
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Transfer API error:", error);
    throw error;
  }
};

// Generic fetch function with error handling and query parameter support
const apiRequest = async (
  endpoint,
  method = "GET",
  body = null,
  queryParams = {}
) => {
  const queryString = Object.keys(queryParams).length
    ? `?${new URLSearchParams(queryParams).toString()}`
    : "";
  const url = `${BASE_URL}${endpoint}${queryString}`;

  let authToken;
  try {
    authToken = getAuthToken();
  } catch (error) {
    throw new Error("Authentication failed: " + error.message);
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: authToken,
  };

  const config = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      // Handle specific error cases
      if (response.status === 401) {
        // Token might be expired, clear it
        localStorage.removeItem("authToken");
        window.location.href = "/login";
        localStorage.removeItem("token");
        throw new Error("Authentication failed. Please log in again.");
      }

      throw new Error(
        `API error: ${response.status} ${response.statusText} - ${
          errorData.message || "Unknown error"
        }`
      );
    }

    const data = await response.json();
    console.log("API response:", data);
    return data;
  } catch (error) {
    console.error(`Failed to fetch ${endpoint}:`, error.message);
    // throw error;
  }
};

export const getWalletBalance = async () => {
  return await apiRequest("/wallet/balances");
};

export const getWalletBalanceForWithDraw = async () => {
  return await apiRequest("/wallet/balance");
};

// Specific API methods
export const getVipInfo = async () => {
  return await apiRequest("/vip/info");
};

export const getVipLevels = async () => {
  return await apiRequest("/vip/levels");
};

export const getVipHistory = async () => {
  return await apiRequest("/vip/history");
};

export const getWithdrawalHistory = async (page = 1, limit = 10) => {
  return await apiRequest("/wallet/withdrawal-history", "GET", null, {
    page,
    limit,
  });
};

export const getDepositHistory = async (page = 1, limit = 10) => {
  return await apiRequest("/wallet/deposit-history", "GET", null, {
    page,
    limit,
  });
};
export const getDirectReferrals = async () => {
  return await apiRequest("/referrals/direct");
};

export const getTeamReferrals = async () => {
  return await apiRequest("/referrals/team");
};

export const getDirectReferralDeposits = async () => {
  return await apiRequest("/referrals/direct/deposits");
};

export const getTeamReferralDeposits = async () => {
  return await apiRequest("/referrals/team/deposits");
};

export const initiateWithdrawal = async (data) => {
  return await apiRequest("/wallet/withdraw", "POST", data);
};

export const getUnclaimedAttendanceBonuses = async () => {
  return await apiRequest("/referrals/attendance/unclaimed");
};

export const claimAttendanceBonus = async (data) => {
  return await apiRequest("/referrals/attendance/claim", "POST", data);
};

export const getInvitationBonusStatus = async () => {
  return await apiRequest("/referrals/invitation/status");
};

export const claimInvitationBonus = async () => {
  return await apiRequest("/referral/invitation/claim", "POST");
};

export const getVipHistoryData = async (page = 1, limit = 10) => {
  return await apiRequest(`/vip/experience-history`, "GET", null, {
    page,
    limit,
  });
};
export const getVipLevelData = async () => {
  return [
    {
      id: 17,
      level: 0,
      required_exp: 0,
      bonus_amount: "0.00",
      monthly_reward: "0.00",
      rebate_rate: "0.0000",
      vault_interest_rate: null,
      created_at: "2025-06-13T16:18:19.000Z",
      updated_at: "2025-06-13T16:18:19.000Z",
    },
    {
      id: 7,
      level: 1,
      required_exp: 3000,
      bonus_amount: "60.00",
      monthly_reward: "30.00",
      rebate_rate: "0.0050",
      vault_interest_rate: "0.0010",
      created_at: "2025-05-12T15:52:16.000Z",
      updated_at: "2025-05-29T08:19:44.000Z",
    },
    {
      id: 8,
      level: 2,
      required_exp: 30000,
      bonus_amount: "180.00",
      monthly_reward: "90.00",
      rebate_rate: "0.0050",
      vault_interest_rate: "0.0010",
      created_at: "2025-05-12T15:52:16.000Z",
      updated_at: "2025-05-29T08:19:44.000Z",
    },
    {
      id: 9,
      level: 3,
      required_exp: 400000,
      bonus_amount: "690.00",
      monthly_reward: "290.00",
      rebate_rate: "0.0100",
      vault_interest_rate: "0.0015",
      created_at: "2025-05-12T15:52:16.000Z",
      updated_at: "2025-05-29T08:19:44.000Z",
    },
    {
      id: 10,
      level: 4,
      required_exp: 4000000,
      bonus_amount: "1890.00",
      monthly_reward: "890.00",
      rebate_rate: "0.0100",
      vault_interest_rate: "0.0020",
      created_at: "2025-05-12T15:52:16.000Z",
      updated_at: "2025-05-29T08:19:44.000Z",
    },
    {
      id: 11,
      level: 5,
      required_exp: 20000000,
      bonus_amount: "6900.00",
      monthly_reward: "1890.00",
      rebate_rate: "0.0100",
      vault_interest_rate: "0.0025",
      created_at: "2025-05-12T15:52:16.000Z",
      updated_at: "2025-05-29T08:19:44.000Z",
    },
    {
      id: 12,
      level: 6,
      required_exp: 80000000,
      bonus_amount: "16900.00",
      monthly_reward: "6900.00",
      rebate_rate: "0.0150",
      vault_interest_rate: "0.0030",
      created_at: "2025-05-12T15:52:16.000Z",
      updated_at: "2025-05-29T08:19:44.000Z",
    },
    {
      id: 13,
      level: 7,
      required_exp: 300000000,
      bonus_amount: "69000.00",
      monthly_reward: "16900.00",
      rebate_rate: "0.0150",
      vault_interest_rate: "0.0035",
      created_at: "2025-05-12T15:52:16.000Z",
      updated_at: "2025-05-29T08:19:44.000Z",
    },
    {
      id: 14,
      level: 8,
      required_exp: 1000000000,
      bonus_amount: "169000.00",
      monthly_reward: "69000.00",
      rebate_rate: "0.0150",
      vault_interest_rate: "0.0040",
      created_at: "2025-05-12T15:52:16.000Z",
      updated_at: "2025-05-29T08:19:44.000Z",
    },
    {
      id: 15,
      level: 9,
      required_exp: 50000000000,
      bonus_amount: "690000.00",
      monthly_reward: "169000.00",
      rebate_rate: "0.0300",
      vault_interest_rate: "0.0045",
      created_at: "2025-05-12T15:52:16.000Z",
      updated_at: "2025-05-29T08:19:44.000Z",
    },
    {
      id: 16,
      level: 10,
      required_exp: 99999999999,
      bonus_amount: "1690000.00",
      monthly_reward: "690000.00",
      rebate_rate: "0.0300",
      vault_interest_rate: "0.0050",
      created_at: "2025-05-12T15:52:16.000Z",
      updated_at: "2025-05-29T08:19:44.000Z",
    },
  ];
};

export const getVaultStatus = async () => {
  return await apiRequest(`/vault/status`, "GET");
};
export const withdrawVault = async (data) => {
  return await apiRequest("/vault/withdraw", "POST", data);
};

export const vaultDeposit = async (data) => {
  return await apiRequest("/vault/deposit", "POST", data);
};
export const getTransactionHistory = async () => {
  return await apiRequest(`/vault/history`, "GET");
};

export const addBankAccount = async (data) => {
  return await apiRequest(`/bank-accounts/accounts`, "POST", data);
};
export const getBankAccounts = async () => {
  return await apiRequest(`/bank-accounts/accounts`, "GET");
};
export const deleteBankAccount = async (id) => {
  return await apiRequest(`/bank-accounts/accounts/${id}`, "DELETE");
};

export const addUSDTAccount = async (data) => {
  return await apiRequest(`/usdt-accounts`, "POST", data);
};

export const getUSDTAccounts = async () => {
  return await apiRequest(`/usdt-accounts`, "GET");
};
export const deleteUSDTAccounts = async (id) => {
  return await apiRequest(`/usdt-accounts/${id}`, "DELETE");
};

export const withDrawMoneyFromWallet = async (data) => {
  return await apiRequest(`/wallet/withdraw`, "POST", data);
};
export const getBettingBalance = async () => {
  return await apiRequest(`/users/betting-requirement`, "GET");
};

export const updateUserProfilePicture = async (data) => {
  return await apiRequest(`/users/profile/picture`, "PUT", data);
};
export const updateUserProfile = async (data) => {
  return await apiRequest(`/users/profile`, "PUT", data);
};
export const getUserProfile = async () => {
  return await apiRequest(`/users/profile`, "GET");
};

export const getUserBets = async (gameType, limit = 10, page = 1) => {
  return await apiRequest(`/games/${gameType}/my-bets`, "GET", null, {
    page,
    limit,
  });
};
export const getUserBetsPerGame = async (gameType,duration , page = 1,limit = 10) => {
  return await apiRequest(`/games/${gameType}/${duration}/my-bets`, "GET", null, {
    page,
    limit,
  });
};

export const getListOfGameAndDuration = () => {
  const duration = [30, 60, 180, 300, 60, 180, 300, 600];

  const result = {
    wingo: duration.slice(0, 4),
    trx_wix: duration.slice(0, 4),
    k3: duration.slice(4),
    "5d": duration.slice(4),
  };
  return result;
};

export const getInHouseGameStats = async (period) => {
  return await apiRequest(
    `/users/in-house-games/stats?period=${period}`,
    "GET"
  );
};
export const getRebateHistory = async (page = 1, limit = 10) => {
  return await apiRequest(`/activity/self-rebate/history`, "GET", null, {
    limit,
    page,
  });
};

export const getRebateHistoryStats = async () => {
  return await apiRequest(`/activity/self-rebate/stats`, "GET");
};

export const getActivityStatus = async () => {
  return await apiRequest(`/activity/status`, "GET");
};
export const claimActivity = async (payload) => {
  return await apiRequest(`/activity/claim`, "POST", payload);
};

export const getAttendanceBonus = async () => {
  return await apiRequest(`/referral/attendance/history`, "GET");
};

export const getReferral = async () => {
  return await apiRequest(`/referral/direct`, "GET");
};
export const getReferralTeam = async () => {
  return await apiRequest(`/referral/team`, "GET");
};

export const getReferralInvitation = async () => {
  return await apiRequest(`/referral/invitation/status`, "GET");
};

export const getGames = async () => {
  return await apiRequest(`/spribe/games`, "GET");
};

export const getAnnouncements = async () => {
  return await apiRequest(`/announcements/latest`, "GET");
};
export const addFeedback = async (payload) => {
  return await apiRequest(`/feedback`, "POST", payload);
};

export const getFeedbacks = async () => {
  return await apiRequest(`/feedback/my`, "GET");
};
export const getGameTransactions = async (params) => {
  const query = new URLSearchParams(params).toString();
  return await apiRequest(`/transaction-reports/my?${query}`, "GET");
};

export const addGift = async (payload) => {
  return await apiRequest(`/gift/claim`, "POST", payload);
};

export const getAllGifts = async (params) => {
  const query = new URLSearchParams(params).toString();
  return await apiRequest(`/gift/history?${query}`, "GET");
};

export const depositPayment = async (payload) => {
  return await apiRequest(`/payments/payin`, "POST", payload);
};

const today = new Date();

const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, "0");
const day = String(today.getDate()).padStart(2, "0");

const formatDate = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
};

const start = new Date(`${year}-${month}-${day}T00:00:00`);
const end = new Date(`${year}-${month}-${day}T23:59:59`);

const startDate = formatDate(start);
const endDate = formatDate(end);
const getReferralDirectData = async () => {
  return await apiRequest(
    `/referral/direct/deposits?start_date=${startDate}&end_date=${endDate}`,
    "GET"
  );
};
export const getReferralTeamData = async () => {
  return await apiRequest(
    `/referral/team/deposits?start_date=${startDate}&end_date=${endDate}`,
    "GET"
  );
};

// 1. Today – no filters
export const getCommissionToday = async () => {
  return await apiRequest(`/referral/commissions`, "GET");
};

// 2. Yesterday
export const getCommissionYesterday = async () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const start = new Date(
    `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(
      yesterday.getDate()
    ).padStart(2, "0")}T00:00:00`
  );
  const end = new Date(start);
  end.setHours(23, 59, 59);

  const startDate = formatDate(start);
  const endDate = formatDate(end);

  return await apiRequest(
    `/referral/commissions?start_date=${startDate}&end_date=${endDate}`,
    "GET"
  );
};

// 3. Last 7 Days
export const getCommissionLast7Days = async () => {
  const today = new Date();
  const end = new Date(today);
  end.setHours(23, 59, 59);

  const start = new Date(today);
  start.setDate(today.getDate() - 6);
  start.setHours(0, 0, 0);

  const startDate = formatDate(start);
  const endDate = formatDate(end);

  return await apiRequest(
    `/referral/commissions?start_date=${startDate}&end_date=${endDate}`,
    "GET"
  );
};
export const getReferralTeamYesterday = async () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const start = new Date(
    `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(
      yesterday.getDate()
    ).padStart(2, "0")}T00:00:00`
  );
  const end = new Date(start);
  end.setHours(23, 59, 59);

  const startDate = formatDate(start);
  const endDate = formatDate(end);
  return await apiRequest(
    `/referral/team?start_date=${startDate}&end_date=${endDate}`,
    "GET"
  );
};
export const getReferralTeamMonth = async () => {
  const today = new Date();

  // Start of the month
  const start = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0);

  // End of today
  const end = new Date(today);
  end.setHours(23, 59, 59);

  const startDate = formatDate(start);
  const endDate = formatDate(end);

  return await apiRequest(
    `/referral/team?start_date=${startDate}&end_date=${endDate}`,
    "GET"
  );
};
export const getReferralTeamToday = async () => {
  return await apiRequest(
    `/referral/team?start_date=${startDate}&end_date=${endDate}`,
    "GET"
  );
};

export const getCommissionWithDate = async (selectedDate) => {
  const { year, month, day } = selectedDate;

  // If no date is selected, make the API call without date filters
  if (!year || !month || !day) {
    return await apiRequest(`/referral/team/deposits`, "GET");
  }

  // Otherwise, build and apply date filters
  const start = new Date(`${year}-${month}-${day}T00:00:00`);
  const end = new Date(`${year}-${month}-${day}T23:59:59.999`);

  const startDate = start.toISOString();
  const endDate = end.toISOString();

  return await apiRequest(
    `/referral/team/deposits?start_date=${startDate}&end_date=${endDate}`,
    "GET"
  );
};
export const getCommissionWithDateData = async (selectedDate) => {
  const { year, month, day } = selectedDate;

  // If no date is selected, make the API call without date filters
  if (!year || !month || !day) {
    return await apiRequest(`/referral/commissions`, "GET");
  }

  // Otherwise, build and apply date filters
  const start = new Date(`${year}-${month}-${day}T00:00:00`);
  const end = new Date(`${year}-${month}-${day}T23:59:59.999`);

  const startDate = start.toISOString();
  const endDate = end.toISOString();

  return await apiRequest(
    `/referral/commissions?start_date=${startDate}&end_date=${endDate}`,
    "GET"
  );
};

export const getLastResult = async (gameType,duration,) => {
  return await apiRequest(`/games/${gameType}/${duration}/last-result`, "GET");
};
export const getGameHistory = async (gameType,duration,page,limit) => {
  return await apiRequest(`/games/${gameType}/${duration}/history?page=${page}&limit=${limit}`, "GET");
};

export default {
  getWalletBalance,
  getVipInfo,
  getVipLevels,
  getVipHistory,
  getWithdrawalHistory,
  getDepositHistory,
  getDirectReferrals,
  getTeamReferrals,
  getDirectReferralDeposits,
  getTeamReferralDeposits,
  initiateWithdrawal,
  getUnclaimedAttendanceBonuses,
  claimAttendanceBonus,
  getInvitationBonusStatus,
  claimInvitationBonus,
  getVipHistoryData,
  getVipLevelData,
  getVaultStatus,
  withdrawVault,
  vaultDeposit,
  getTransactionHistory,
  addBankAccount,
  getBankAccounts,
  getWalletBalanceForWithDraw,
  getUSDTAccounts,
  addUSDTAccount,
  deleteBankAccount,
  deleteUSDTAccounts,
  withDrawMoneyFromWallet,
  getBettingBalance,
  getUserProfile,
  updateUserProfilePicture,
  updateUserProfile,
  getUserBets,
  getListOfGameAndDuration,
  getInHouseGameStats,
  getRebateHistory,
  getRebateHistoryStats,
  getActivityStatus,
  claimActivity,
  getAttendanceBonus,
  getReferral,
  getReferralTeam,
  getReferralInvitation,
  getGames,
  getAnnouncements,
  addFeedback,
  getFeedbacks,
  getGameTransactions,
  addGift,
  getAllGifts,
  depositPayment,
  getReferralDirectData,
  getReferralTeamData,
  getCommissionToday,
  getCommissionLast7Days,
  getCommissionYesterday,
  getReferralTeamMonth,
  getReferralTeamYesterday,
  getReferralTeamToday,
  getCommissionWithDate,
  getCommissionWithDateData,
  getUserBetsPerGame,
  getLastResult,
  getGameHistory
};
