import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import LotteryGameDetailedHeader from '../../../components/LotterygameDetailedHeader';
import gameApi from '../../../api/gameAPI';

const OrderDetailsComponent = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState('Win Go30s');
  const [orderData, setOrderData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { betId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get data from navigation state or fetch from API
  const passedOrderData = location.state?.orderData;

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const tabs = ['Win Go30s', 'Win Go1Min', 'Win Go3Min', 'Win Go5Min'];

  // Fetch order details if not passed via navigation
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (passedOrderData) {
        // Use data passed from navigation
        setOrderData(formatOrderData(passedOrderData));
        setIsLoading(false);
        return;
      }

      if (!betId) {
        setError('No bet ID provided');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch specific bet details from API
        const response = await gameApi.getBetDetails(betId);
        
        if (response && response.success && response.data) {
          setOrderData(formatOrderData(response.data));
        } else {
          setError('Failed to fetch order details');
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
        setError('Failed to load order details: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [betId, passedOrderData]);

  // Format API data to match component structure
  const formatOrderData = (bet) => {
    const createdDate = bet.createdAt ? new Date(bet.createdAt) : new Date();
    const betAmount = bet.betAmount || bet.amount || 0;
    const profitLoss = bet.profitLoss || 0;
    
    return {
      id: bet.periodId || bet.period || 'N/A',
      date: createdDate.toLocaleString('en-IN', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: false 
      }),
      orderNumber: bet.betId || bet.orderNumber || 'N/A',
      period: bet.periodId || bet.period || 'N/A',
      purchaseAmount: `₹${betAmount.toFixed(2)}`,
      quantity: bet.quantity || 1,
      amountAfterTax: `₹${(betAmount * 0.98).toFixed(2)}`,
      tax: `₹${(betAmount * 0.02).toFixed(2)}`,
      result: formatResult(bet.result),
      select: formatSelection(bet.betType, bet.betValue, bet.select),
      status: bet.status || (profitLoss > 0 ? 'Won' : profitLoss < 0 ? 'Lost' : 'Pending'),
      winLose: profitLoss >= 0 ? `+ ₹${profitLoss.toFixed(2)}` : `- ₹${Math.abs(profitLoss).toFixed(2)}`,
      // Additional fields for better display
      betType: bet.betType || 'Unknown',
      betValue: bet.betValue || 'N/A',
      gameType: bet.gameType || 'wingo',
      duration: bet.duration || '30s'
    };
  };

  // Format result display
  const formatResult = (result) => {
    if (!result) return 'Pending';
    
    if (typeof result === 'string') return result;
    
    if (typeof result === 'object') {
      const number = result.number || result.num || '?';
      const color = result.color || '?';
      const size = result.size || '?';
      return `${number} ${color} ${size}`;
    }
    
    return 'N/A';
  };

  // Format selection display
  const formatSelection = (betType, betValue, select) => {
    if (select) return select;
    if (betType && betValue) return `${betType}: ${betValue}`;
    return 'N/A';
  };

  // Get display color and classes based on bet result
  const getResultDisplay = (result, betType, betValue) => {
    if (!result || result === 'Pending') {
      return <span className="text-yellow-400">Pending</span>;
    }

    const parts = result.split(' ');
    if (parts.length >= 3) {
      const number = parts[0];
      const color = parts[1];
      const size = parts[2];
      
      return (
        <span>
          <span className="text-gray-300">{number} </span>
          <span className={`${
            color.toLowerCase() === 'green' ? 'text-green-500' : 
            color.toLowerCase() === 'red' ? 'text-red-500' : 
            color.toLowerCase() === 'violet' ? 'text-purple-500' : 
            'text-gray-300'
          }`}>{color} </span>
          <span className={`${
            size.toLowerCase() === 'small' ? 'text-blue-400' : 'text-orange-400'
          }`}>{size}</span>
        </span>
      );
    }
    
    return <span className="text-gray-300">{result}</span>;
  };

  // Get selection display with appropriate styling
  const getSelectionDisplay = (betType, betValue, select) => {
    const selection = select || `${betType}: ${betValue}`;
    
    if (selection.toLowerCase().includes('small')) {
      return <span className="text-blue-400">{selection}</span>;
    } else if (selection.toLowerCase().includes('big')) {
      return <span className="text-orange-400">{selection}</span>;
    } else if (selection.toLowerCase().includes('green')) {
      return <span className="text-green-500">{selection}</span>;
    } else if (selection.toLowerCase().includes('red')) {
      return <span className="text-red-500">{selection}</span>;
    } else if (selection.toLowerCase().includes('violet')) {
      return <span className="text-purple-500">{selection}</span>;
    }
    
    return <span className="text-gray-300">{selection}</span>;
  };

  const TabBar = () => (
    <div style={{ backgroundColor: '#333332' }} className="w-full border-b mt-14 border-gray-700">
      <LotteryGameDetailedHeader />
      <div className="flex">
        {tabs.map((tab) => (
          <div
            key={tab}
            className={`px-4 py-2 text-sm cursor-pointer ${
              activeTab === tab ? 'text-white border-b-2 border-yellow-500' : 'text-gray-400'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </div>
        ))}
      </div>
    </div>
  );

  const DetailItem = ({ label, value, valueClass = 'text-gray-300' }) => (
    <div className="flex justify-between px-3 py-2 bg-[#4d4d4c] mb-2 rounded-md">
      <div className="text-gray-300">{label}</div>
      <div className={valueClass}>{value}</div>
    </div>
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen" style={{ backgroundColor: '#242424' }}>
        <div className="w-full h-full flex items-center justify-center" style={{ width: '450px', maxWidth: '450px' }}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
            <p className="text-white">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen" style={{ backgroundColor: '#242424' }}>
        <div className="w-full h-full flex items-center justify-center" style={{ width: '450px', maxWidth: '450px' }}>
          <div className="text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-600"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No data state
  if (!orderData) {
    return (
      <div className="flex justify-center items-center h-screen" style={{ backgroundColor: '#242424' }}>
        <div className="w-full h-full flex items-center justify-center" style={{ width: '450px', maxWidth: '450px' }}>
          <div className="text-center">
            <p className="text-gray-400 mb-4">No order data found</p>
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-600"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const CollapsedView = () => (
    <div className="flex flex-col h-full" style={{ backgroundColor: '#242424' }}>
      <TabBar />

      <div className="cursor-pointer mt-6" onClick={toggleExpand} style={{ backgroundColor: '#333332' }}>
        <div className="flex items-center justify-between p-3 border-b border-gray-700">
          <div className="flex items-center">
            <div className={`text-white rounded-md p-2 mr-3 text-xs ${
              orderData.betType === 'color' && orderData.betValue?.toLowerCase() === 'green' ? 'bg-green-500' :
              orderData.betType === 'color' && orderData.betValue?.toLowerCase() === 'red' ? 'bg-red-500' :
              orderData.betType === 'color' && orderData.betValue?.toLowerCase() === 'violet' ? 'bg-purple-500' :
              orderData.betType === 'size' && orderData.betValue?.toLowerCase() === 'small' ? 'bg-blue-500' :
              orderData.betType === 'size' && orderData.betValue?.toLowerCase() === 'big' ? 'bg-orange-500' :
              orderData.betType === 'number' ? 'bg-gray-600' : 'bg-gray-500'
            }`}>
              <span>{orderData.betValue || orderData.betType || 'bet'}</span>
            </div>
            <div>
              <div className="text-sm text-white">{orderData.id}</div>
              <div className="text-xs text-gray-400">{orderData.date}</div>
            </div>
          </div>
          <div className="text-right">
            <div className={`border rounded-md px-2 py-1 text-sm ${
              orderData.status === 'Won' ? 'text-green-500 border-green-500' :
              orderData.status === 'Lost' ? 'text-red-500 border-red-500' :
              'text-yellow-500 border-yellow-500'
            }`}>
              {orderData.status}
            </div>
            <div className={`text-sm mt-1 ${
              orderData.winLose.startsWith('+') ? 'text-green-500' :
              orderData.winLose.startsWith('-') ? 'text-red-500' :
              'text-gray-400'
            }`}>
              {orderData.winLose}
            </div>
          </div>
        </div>
      </div>

      <div className="p-2 flex justify-between items-center" style={{ backgroundColor: '#333332' }}>
        <button 
          className="bg-gray-700 rounded-md p-2 text-gray-400"
          onClick={() => navigate(-1)}
        >
          &lt;
        </button>
        <div className="text-sm text-white">1/1</div>
        <button className="bg-gray-700 rounded-md p-2 text-gray-400">&gt;</button>
      </div>

      <div className="flex-grow" style={{ backgroundColor: '#242424' }}></div>
    </div>
  );

  const ExpandedView = () => (
    <div className="flex flex-col h-full" style={{ backgroundColor: '#242424' }}>
      <TabBar />

      <div className="cursor-pointer" onClick={toggleExpand} style={{ backgroundColor: '#333332' }}>
        <div className="flex items-center justify-between p-3 border-b border-gray-700">
          <div className="flex items-center">
            <div className={`text-white rounded-md p-2 mr-3 text-xs ${
              orderData.betType === 'color' && orderData.betValue?.toLowerCase() === 'green' ? 'bg-green-500' :
              orderData.betType === 'color' && orderData.betValue?.toLowerCase() === 'red' ? 'bg-red-500' :
              orderData.betType === 'color' && orderData.betValue?.toLowerCase() === 'violet' ? 'bg-purple-500' :
              orderData.betType === 'size' && orderData.betValue?.toLowerCase() === 'small' ? 'bg-blue-500' :
              orderData.betType === 'size' && orderData.betValue?.toLowerCase() === 'big' ? 'bg-orange-500' :
              orderData.betType === 'number' ? 'bg-gray-600' : 'bg-gray-500'
            }`}>
              <span>{orderData.betValue || orderData.betType || 'bet'}</span>
            </div>
            <div>
              <div className="text-sm text-white">{orderData.id}</div>
              <div className="text-xs text-gray-400">{orderData.date}</div>
            </div>
          </div>
          <div className="text-right">
            <div className={`border rounded-md px-2 py-1 text-sm ${
              orderData.status === 'Won' ? 'text-green-500 border-green-500' :
              orderData.status === 'Lost' ? 'text-red-500 border-red-500' :
              'text-yellow-500 border-yellow-500'
            }`}>
              {orderData.status}
            </div>
            <div className={`text-sm mt-1 ${
              orderData.winLose.startsWith('+') ? 'text-green-500' :
              orderData.winLose.startsWith('-') ? 'text-red-500' :
              'text-gray-400'
            }`}>
              {orderData.winLose}
            </div>
          </div>
        </div>
      </div>

      <div className="p-3" style={{ backgroundColor: '#333332' }}>
        <h2 className="text-lg font-semibold text-white mb-4">Details</h2>

        <DetailItem label="Order number" value={orderData.orderNumber} />
        <DetailItem label="Period" value={orderData.period} />  
        <DetailItem label="Purchase amount" value={orderData.purchaseAmount} />
        <DetailItem label="Quantity" value={orderData.quantity} />
        <DetailItem label="Amount after tax" value={orderData.amountAfterTax} valueClass="text-red-500" />
        <DetailItem label="Tax" value={orderData.tax} />
        <DetailItem
          label="Result"
          value={getResultDisplay(orderData.result, orderData.betType, orderData.betValue)}
        />
        <DetailItem 
          label="Select" 
          value={getSelectionDisplay(orderData.betType, orderData.betValue, orderData.select)}
        />
        <DetailItem 
          label="Status" 
          value={orderData.status} 
          valueClass={
            orderData.status === 'Won' ? 'text-green-500' :
            orderData.status === 'Lost' ? 'text-red-500' :
            'text-yellow-500'
          } 
        />
        <DetailItem 
          label="Win/lose" 
          value={orderData.winLose} 
          valueClass={
            orderData.winLose.startsWith('+') ? 'text-green-500' :
            orderData.winLose.startsWith('-') ? 'text-red-500' :
            'text-gray-400'
          }
        />
        <DetailItem label="Order time" value={orderData.date} />
      </div>

      <div className="flex-grow" style={{ backgroundColor: '#242424' }}></div>
    </div>
  );

  return (
    <div className="flex justify-center h-screen" style={{ backgroundColor: '#242424' }}>
      <div className="w-full h-full" style={{ width: '450px', maxWidth: '450px' }}>
        {isExpanded ? <ExpandedView /> : <CollapsedView />}
      </div>
    </div>
  );
};

export default OrderDetailsComponent;