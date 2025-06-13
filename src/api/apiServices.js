const BASE_URL = "https://strike.atsproduct.in/api";

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
  const bearerToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
  console.log("Final Authorization header:", bearerToken);
  
  return bearerToken;
};

export const transferFromThirdParty = async () => {
  try {
    const token = localStorage.getItem('authToken'); // Adjust based on your auth implementation
    const response = await fetch('https://strike.atsproduct.in/api/wallet/transfer-from-third-party', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Adjust based on your auth implementation
      },
      body: JSON.stringify({
        // Add any required parameters here based on your API documentation
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Transfer API error:', error);
    throw error;
  }
};

// Generic fetch function with error handling and query parameter support
const apiRequest = async (endpoint, method = "GET", body = null, queryParams = {}) => {
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

  console.log("Making API request:", {
    url,
    method,
    headers: { ...headers, Authorization: "Bearer [TOKEN_HIDDEN]" } // Hide token in logs
  });

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // Handle specific error cases
      if (response.status === 401) {
        // Token might be expired, clear it
        localStorage.removeItem("authToken");
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
    throw error;
  }
};

export const getWalletBalance = async () => {
  return await apiRequest("/wallet/balances");
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
  return await apiRequest("/wallet/withdrawals", "GET", null, { page, limit });
};

export const getDepositHistory = async (page = 1, limit = 10) => {
  return await apiRequest("/wallet/deposits", "GET", null, { page, limit });
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
  return await apiRequest("/referrals/invitation/claim", "POST");
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
};