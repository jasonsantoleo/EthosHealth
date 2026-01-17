import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Wallet as WalletIcon, Coins, Gift, History, Heart, Shield, Ambulance, Building, CheckCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { LocalStorage, mockHospitals } from "@/lib/storage";

interface VoucherData {
  id: string;
  name: string;
  description: string;
  amount: number;
  type: 'diabetes-care' | 'general-health' | 'emergency-care';
  validUntil: string;
  icon: any;
  color: string;
}

export default function Wallet() {
  const [walletBalance, setWalletBalance] = useState(1250);
  const [voucherCount, setVoucherCount] = useState(3);
  const [showHospitalModal, setShowHospitalModal] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<VoucherData | null>(null);
  const [claimedVouchers, setClaimedVouchers] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const vouchers: VoucherData[] = [
    {
      id: 'diabetes-care-voucher',
      name: 'Diabetes Care Scheme',
      description: 'Comprehensive diabetes management voucher for specialized care and medications',
      amount: 500,
      type: 'diabetes-care',
      validUntil: 'Dec 31, 2024',
      icon: Heart,
      color: 'border-medilinkx-green text-medilinkx-green'
    },
    {
      id: 'general-health-voucher',
      name: 'General Health Shield',
      description: 'Basic health insurance voucher covering routine checkups and emergency care',
      amount: 300,
      type: 'general-health',
      validUntil: 'Dec 31, 2024',
      icon: Shield,
      color: 'border-medilinkx-blue text-medilinkx-blue'
    },
    {
      id: 'emergency-care-voucher',
      name: 'Emergency Care Voucher',
      description: 'Emergency medical care voucher for urgent treatments and procedures',
      amount: 1000,
      type: 'emergency-care',
      validUntil: 'Dec 31, 2024',
      icon: Ambulance,
      color: 'border-medilinkx-orange text-medilinkx-orange'
    }
  ];

  useEffect(() => {
    // Load wallet data from localStorage
    const balance = LocalStorage.getWalletBalance();
    setWalletBalance(balance);
  }, []);

  const handleClaimVoucher = (voucher: VoucherData) => {
    setSelectedVoucher(voucher);
    setShowHospitalModal(true);
  };

  const handleHospitalSelect = (hospitalName: string) => {
    if (!selectedVoucher) return;

    setShowHospitalModal(false);
    
    // Show processing notification
    toast({
      title: "Processing Payment",
      description: "Your voucher claim is being processed...",
    });

    setTimeout(() => {
      // Update wallet balance
      const newBalance = walletBalance - selectedVoucher.amount;
      setWalletBalance(newBalance);
      LocalStorage.setWalletBalance(newBalance);

      // Update voucher count
      const newCount = voucherCount - 1;
      setVoucherCount(newCount);

      // Mark voucher as claimed
      setClaimedVouchers(prev => new Set([...prev, selectedVoucher.id]));

      // Generate transaction data
      const transactionId = `TXN${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      const transaction = {
        id: transactionId,
        voucherId: selectedVoucher.id,
        hospitalName,
        amount: selectedVoucher.amount,
        status: 'completed' as const,
        transactionId,
        createdAt: new Date(),
      };

      LocalStorage.setLastTransaction(transaction);

      // Show success notification
      toast({
        title: "Payment Successful!",
        description: `$${selectedVoucher.amount} voucher successfully transferred to ${hospitalName}. Transaction ID: ${transactionId}. Funds received.`,
        duration: 8000,
      });

      // Navigate to receipt page after delay
      setTimeout(() => {
        window.location.href = '/receipt';
      }, 2000);
    }, 3000);
  };

  return (
    <div className="pt-16">
      <section className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 fade-in">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Crypto Wallet & Health Vouchers</h1>
            <p className="text-xl text-gray-600">Manage your digital health vouchers and make secure payments</p>
          </div>

          {/* Wallet Overview */}
          <Card className="glassmorphism rounded-2xl mb-8 slide-up">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold text-gray-800 flex items-center">
                  <WalletIcon className="text-medilinkx-blue mr-3 h-8 w-8" />
                  MediLinkX Wallet
                </h3>
                <div className="bg-medilinkx-green bg-opacity-10 text-medilinkx-green px-4 py-2 rounded-full text-sm font-semibold">
                  <CheckCircle className="inline mr-2 h-4 w-4" />
                  Connected
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Wallet Balance */}
                <div className="wallet-card rounded-xl p-6 text-center">
                  <Coins className="text-medilinkx-blue h-12 w-12 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">USDC Balance</h4>
                  <div 
                    className="text-3xl font-bold text-medilinkx-blue mb-2" 
                    data-testid="wallet-balance"
                  >
                    ${walletBalance.toFixed(2)}
                  </div>
                  <p className="text-gray-600 text-sm">Available for payments</p>
                </div>

                {/* Total Vouchers */}
                <div className="wallet-card rounded-xl p-6 text-center">
                  <Gift className="text-medilinkx-green h-12 w-12 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">Active Vouchers</h4>
                  <div 
                    className="text-3xl font-bold text-medilinkx-green mb-2" 
                    data-testid="voucher-count"
                  >
                    {voucherCount}
                  </div>
                  <p className="text-gray-600 text-sm">Ready to claim</p>
                </div>

                {/* Transaction History */}
                <div className="wallet-card rounded-xl p-6 text-center">
                  <History className="text-medilinkx-orange h-12 w-12 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">Transactions</h4>
                  <div className="text-3xl font-bold text-medilinkx-orange mb-2">12</div>
                  <p className="text-gray-600 text-sm">Completed payments</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Available Vouchers */}
          <Card className="glassmorphism rounded-2xl mb-8 slide-up">
            <CardContent className="p-8">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <Gift className="text-medilinkx-green mr-3 h-8 w-8" />
                Available Health Vouchers
              </h3>
              
              <div className="space-y-4">
                {vouchers.map((voucher) => {
                  const Icon = voucher.icon;
                  const isClaimed = claimedVouchers.has(voucher.id);

                  return (
                    <div 
                      key={voucher.id}
                      className={`bg-white rounded-xl p-6 border-l-4 ${voucher.color} hover:shadow-lg transition-shadow ${isClaimed ? 'opacity-50' : ''}`}
                    >
                      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center mb-3">
                            <Icon className={`${voucher.color.split(' ')[1]} h-6 w-6 mr-3`} />
                            <h4 className="text-xl font-semibold text-gray-800">{voucher.name}</h4>
                            {!isClaimed && (
                              <span className="bg-medilinkx-green text-white px-3 py-1 rounded-full text-sm font-semibold ml-3">
                                Active
                              </span>
                            )}
                            {isClaimed && (
                              <span className="bg-gray-500 text-white px-3 py-1 rounded-full text-sm font-semibold ml-3">
                                Claimed
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 mb-3">{voucher.description}</p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div><strong>Voucher Value:</strong> ${voucher.amount.toFixed(2)}</div>
                            <div><strong>Valid Until:</strong> {voucher.validUntil}</div>
                            <div><strong>Network:</strong> All major hospitals</div>
                          </div>
                        </div>
                        <div className="lg:w-auto w-full">
                          {isClaimed ? (
                            <div className="text-center">
                              <CheckCircle className="h-8 w-8 text-medilinkx-green mx-auto mb-2" />
                              <span className="text-medilinkx-green font-semibold">Claimed</span>
                            </div>
                          ) : (
                            <Button
                              onClick={() => handleClaimVoucher(voucher)}
                              className={`w-full lg:w-auto ${voucher.color.includes('green') ? 'bg-medilinkx-green hover:bg-green-700' : voucher.color.includes('blue') ? 'bg-medilinkx-blue hover:bg-blue-700' : 'bg-medilinkx-orange hover:bg-orange-600'} text-white px-6 py-3 rounded-lg font-semibold`}
                              data-testid={`button-claim-${voucher.type}`}
                            >
                              <Building className="mr-2 h-5 w-5" />
                              Claim & Pay to Hospital
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Hospital Selection Modal */}
          <Dialog open={showHospitalModal} onOpenChange={setShowHospitalModal}>
            <DialogContent className="max-w-md" data-testid="hospital-modal">
              <DialogHeader>
                <DialogTitle className="text-center text-2xl font-semibold text-gray-800">
                  Select Hospital
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                {mockHospitals.map((hospital) => (
                  <Button
                    key={hospital.name}
                    variant="outline"
                    className="w-full text-left p-4 h-auto border border-gray-300 hover:border-medilinkx-blue hover:bg-blue-50"
                    onClick={() => handleHospitalSelect(hospital.name)}
                    data-testid={`button-select-${hospital.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <div>
                      <div className="font-semibold text-gray-800">{hospital.name}</div>
                      <div className="text-gray-600 text-sm">{hospital.location}</div>
                    </div>
                  </Button>
                ))}
              </div>
              <Button
                variant="secondary"
                className="w-full mt-6"
                onClick={() => setShowHospitalModal(false)}
                data-testid="button-cancel-hospital"
              >
                Cancel
              </Button>
            </DialogContent>
          </Dialog>
        </div>
      </section>
    </div>
  );
}
