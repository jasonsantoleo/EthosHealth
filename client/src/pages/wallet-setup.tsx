import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Wallet, CreditCard, ArrowRight, CheckCircle, DollarSign, TrendingUp, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface UserProfile {
  abha_id: string;
  name: string;
  dateOfBirth: string;
  walletBalance: number;
  coinbaseAddress: string;
  transactions: any[];
}

export default function WalletSetup() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isFunding, setIsFunding] = useState(false);
  const [fundAmount, setFundAmount] = useState("");
  const [walletConnected, setWalletConnected] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load user profile from API or localStorage
    const loadUserProfile = async () => {
      try {
        const abhaId = localStorage.getItem('abha_id');
        if (!abhaId) {
          toast({
            title: "ABHA ID Required",
            description: "Please enter your ABHA ID first on the Create HealthID page.",
            variant: "destructive",
          });
          return;
        }

        // First try to get from localStorage (faster)
        const storedProfile = localStorage.getItem('user_profile');
        if (storedProfile) {
          try {
            const user = JSON.parse(storedProfile);
            const profile: UserProfile = {
              abha_id: user.abha_id,
              name: user.name,
              dateOfBirth: user.dateOfBirth || "1988-05-15",
              walletBalance: user.wallet_balance || 0,
              coinbaseAddress: user.coinbase_wallet_address || "",
              transactions: user.transactions || []
            };
            setUserProfile(profile);
            
            // Check if wallet is already connected
            if (user.coinbase_wallet_address) {
              setWalletConnected(true);
            }
            return;
          } catch (e) {
            console.error('Error parsing stored profile:', e);
          }
        }

        // If not in localStorage, fetch from API
        const response = await fetch(`/api/wallet/user/${abhaId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            toast({
              title: "User Not Found",
              description: `ABHA ID ${abhaId} is not registered. Please run 'npm run seed:users' to seed the database.`,
              variant: "destructive",
            });
            return;
          }
          throw new Error('Failed to fetch user profile');
        }

        const data = await response.json();
        
        if (!data.success || !data.user) {
          throw new Error('Invalid response from server');
        }

        const user = data.user;
        
        // Create user profile from API data
        const profile: UserProfile = {
          abha_id: user.abha_id,
          name: user.name,
          dateOfBirth: user.dateOfBirth || "1988-05-15",
          walletBalance: user.wallet_balance || 0,
          coinbaseAddress: user.coinbase_wallet_address || "",
          transactions: user.transactions || []
        };
        
        setUserProfile(profile);
        
        // Store in localStorage for future use
        localStorage.setItem('user_profile', JSON.stringify(user));
        
        // Check if wallet is already connected
        if (user.coinbase_wallet_address) {
          setWalletConnected(true);
        }
      } catch (error: any) {
        console.error('Error loading user profile:', error);
        toast({
          title: "Failed to Load Profile",
          description: error.message || "Could not load user profile. Please ensure the server is running.",
          variant: "destructive",
        });
      }
    };

    loadUserProfile();
  }, []);

  const handleConnectWallet = async () => {
    if (!userProfile) return;
    
    setIsConnecting(true);
    
    try {
      // Call API to connect wallet
      const response = await fetch('/api/wallet/connect-wallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          abha_id: userProfile.abha_id
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to connect wallet' }));
        throw new Error(errorData.message || 'Failed to connect wallet');
      }

      const data = await response.json();
      
      if (data.success && data.wallet_address) {
        const updatedProfile = {
          ...userProfile,
          coinbaseAddress: data.wallet_address
        };
        setUserProfile(updatedProfile);
        setWalletConnected(true);
        
        // Update localStorage
        const storedProfile = localStorage.getItem('user_profile');
        if (storedProfile) {
          const user = JSON.parse(storedProfile);
          user.coinbase_wallet_address = data.wallet_address;
          localStorage.setItem('user_profile', JSON.stringify(user));
        }
        localStorage.setItem('wallet_address', data.wallet_address);
        
        toast({
          title: "Wallet Connected Successfully!",
          description: `Connected to Ethereum wallet: ${data.wallet_address.substring(0, 8)}...${data.wallet_address.substring(data.wallet_address.length - 6)}`,
        });
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error: any) {
      console.error('Wallet connection error:', error);
      
      // Fallback to mock address if API fails (for demo purposes)
      const mockAddress = userProfile.coinbaseAddress || `0x${Math.random().toString(16).substr(2, 40)}`;
      const updatedProfile = {
        ...userProfile,
        coinbaseAddress: mockAddress
      };
      setUserProfile(updatedProfile);
      setWalletConnected(true);
      
      localStorage.setItem('wallet_address', mockAddress);
      
      toast({
        title: "Wallet Connected (Demo Mode)",
        description: `Connected to Ethereum wallet: ${mockAddress.substring(0, 8)}...${mockAddress.substring(mockAddress.length - 6)}`,
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleFundWallet = async () => {
    if (!fundAmount || parseFloat(fundAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount greater than 0.",
        variant: "destructive",
      });
      return;
    }

    setIsFunding(true);
    
    try {
      // Simulate funding process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const amount = parseFloat(fundAmount);
      
      if (userProfile) {
        const updatedProfile = {
          ...userProfile,
          walletBalance: userProfile.walletBalance + amount
        };
        setUserProfile(updatedProfile);
        
        // Store wallet balance in localStorage
        localStorage.setItem('walletBalance', updatedProfile.walletBalance.toString());
        
        // Add transaction
        const transaction = {
          id: `tx-${Date.now()}`,
          type: 'fund',
          amount: amount,
          status: 'completed',
          timestamp: new Date().toISOString(),
          description: 'Wallet funding'
        };
        
        const updatedTransactions = [...userProfile.transactions, transaction];
        updatedProfile.transactions = updatedTransactions;
        setUserProfile(updatedProfile);
        
        toast({
          title: "Wallet Funded Successfully!",
          description: `Added $${amount.toLocaleString()} USDC to your wallet.`,
        });
        
        setFundAmount("");
      }
    } catch (error) {
      console.error('Funding error:', error);
      toast({
        title: "Funding Failed",
        description: "Failed to fund wallet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsFunding(false);
    }
  };

  const getMockTransactions = () => {
    // Use actual transactions from user profile if available
    if (userProfile?.transactions && userProfile.transactions.length > 0) {
      return userProfile.transactions.map((tx: any) => ({
        id: tx.id || `tx-${Date.now()}`,
        type: tx.type || 'fund',
        amount: tx.amount || 0,
        status: tx.status || 'completed',
        timestamp: tx.timestamp ? (typeof tx.timestamp === 'string' ? tx.timestamp : tx.timestamp.toISOString()) : new Date().toISOString(),
        description: tx.description || 'Transaction'
      }));
    }
    
    // Fallback to mock transactions if none available
    return [
      {
        id: 'tx-001',
        type: 'fund',
        amount: 1000,
        status: 'completed',
        timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        description: 'Initial wallet funding'
      },
      {
        id: 'tx-002',
        type: 'transfer',
        amount: -150,
        status: 'completed',
        timestamp: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
        description: 'Hospital payment - Apollo'
      }
    ];
  };

  if (!userProfile) {
    return (
      <div className="pt-16">
        <section className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medilinkx-blue mx-auto mb-4"></div>
            <p>Loading user profile...</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="pt-16">
      <section className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 fade-in">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Ethereum Wallet Setup</h1>
            <p className="text-xl text-gray-600">Connect your Ethereum wallet (e.g., MetaMask) for healthcare payments on Sepolia</p>
          </div>

          {/* User Profile Card */}
          <Card className="glassmorphism rounded-2xl mb-8 slide-up">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-800">User Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold text-gray-700 mb-2">Personal Information</h4>
                  <p className="text-gray-600"><strong>Name:</strong> {userProfile.name}</p>
                  <p className="text-gray-600"><strong>ABHA ID:</strong> <span className="font-mono">{userProfile.abha_id}</span></p>
                  <p className="text-gray-600"><strong>Date of Birth:</strong> {userProfile.dateOfBirth}</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold text-gray-700 mb-2">Wallet Status</h4>
                  <p className="text-gray-600">
                    <strong>Status:</strong> 
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                      walletConnected ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {walletConnected ? 'Connected' : 'Not Connected'}
                    </span>
                  </p>
                  {walletConnected && (
                    <p className="text-gray-600">
                      <strong>Address:</strong> 
                      <span className="ml-2 font-mono text-sm">
                        {userProfile.coinbaseAddress.substring(0, 8)}...{userProfile.coinbaseAddress.substring(userProfile.coinbaseAddress.length - 6)}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Wallet Connection */}
            <Card className="glassmorphism rounded-2xl slide-up">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-800 flex items-center">
                  <Wallet className="mr-3 h-8 w-8 text-medilinkx-blue" />
                  Connect Wallet
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!walletConnected ? (
                  <div className="text-center space-y-4">
                    <div className="bg-blue-50 rounded-lg p-6">
                      <CreditCard className="h-16 w-16 text-medilinkx-blue mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Ethereum Wallet</h3>
                      <p className="text-gray-600 mb-4">
                        Connect your Ethereum wallet (MetaMask/WalletConnect). For testing, use Sepolia ETH from a faucet.
                      </p>
                      <Button 
                        onClick={handleConnectWallet}
                        disabled={isConnecting}
                        className="bg-medilinkx-blue hover:bg-blue-700 px-8 py-3 font-semibold"
                      >
                        {isConnecting ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Connecting...
                          </>
                        ) : (
                          <>
                            <Wallet className="mr-2 h-5 w-5" />
                            Connect Wallet
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="bg-green-50 rounded-lg p-6">
                      <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Wallet Connected!</h3>
                      <p className="text-gray-600 mb-4">
                        Your Ethereum wallet is successfully connected and ready for healthcare payments.
                      </p>
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-sm text-gray-600">Wallet Address:</p>
                        <p className="font-mono text-sm text-gray-800 break-all">
                          {userProfile.coinbaseAddress}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Fund Your Wallet */}
            <Card className="glassmorphism rounded-2xl slide-up">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-800 flex items-center">
                  <DollarSign className="mr-3 h-8 w-8 text-medilinkx-green" />
                  Fund Your Wallet
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-semibold text-gray-700 mb-2">Current Balance</h4>
                    <div className="text-3xl font-bold text-medilinkx-blue">
                      ${userProfile.walletBalance.toLocaleString()}
                    </div>
                    <p className="text-sm text-gray-600">USDC Available</p>
                  </div>
                  
                  {walletConnected ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Amount to Add (USDC)
                        </label>
                        <Input
                          type="number"
                          placeholder="Enter amount"
                          value={fundAmount}
                          onChange={(e) => setFundAmount(e.target.value)}
                          className="w-full"
                        />
                      </div>
                      <Button 
                        onClick={handleFundWallet}
                        disabled={isFunding || !fundAmount || parseFloat(fundAmount) <= 0}
                        className="w-full bg-medilinkx-green hover:bg-green-700 py-3 font-semibold"
                      >
                        {isFunding ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Funding...
                          </>
                        ) : (
                          <>
                            <DollarSign className="mr-2 h-5 w-5" />
                            Add Funds
                          </>
                        )}
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      <Wallet className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                      <p>Connect your wallet first to add funds</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Transactions */}
          <Card className="glassmorphism rounded-2xl mt-8 slide-up">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-800 flex items-center">
                <Activity className="mr-3 h-8 w-8 text-medilinkx-orange" />
                Recent Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getMockTransactions().map((tx) => (
                  <div key={tx.id} className="bg-white rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 ${
                        tx.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'
                      }`}></div>
                      <div>
                        <p className="font-medium text-gray-800">{tx.description}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(tx.timestamp).toLocaleDateString()} at {new Date(tx.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        tx.amount > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">USDC</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Continue Button */}
          {walletConnected && (
            <div className="text-center mt-8">
              <Link href="/ai-recommendation">
                <Button 
                  className="bg-medilinkx-green hover:bg-green-700 px-8 py-3 font-semibold"
                >
                  Continue to AI Recommendation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <p className="text-sm text-gray-600 mt-2">
                Get personalized health scheme recommendations based on your profile
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
