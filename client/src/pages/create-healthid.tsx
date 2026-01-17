import { useState } from "react";
import { Link } from "wouter";
import { Search, UserCheck, Shield, ArrowRight, CheckCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface UserProfile {
  abha_id: string;
  name: string;
  dateOfBirth: string;
  address: string;
  walletBalance: number;
  coinbaseAddress: string;
}

export default function CreateHealthId() {
  const [abhaIdInput, setAbhaIdInput] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const { toast } = useToast();

  const handleVerifyAbhaId = async () => {
    if (!abhaIdInput.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid ABHA ID",
        variant: "destructive",
      });
      return;
    }

    if (abhaIdInput.length !== 14) {
      toast({
        title: "Invalid ABHA ID",
        description: "ABHA ID must be exactly 14 characters long",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    
    try {
      // Simulate verification process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create mock verified user profile
      const profile: UserProfile = {
        abha_id: abhaIdInput,
        name: "John Doe",
        dateOfBirth: "1988-05-15",
        address: "123 Healthcare Street, Mumbai, Maharashtra - 400001",
        walletBalance: 1250,
        coinbaseAddress: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6"
      };
      
      setUserProfile(profile);
      setIsVerified(true);
      
      // Store ABHA ID in localStorage
      localStorage.setItem('abha_id', abhaIdInput);
      
      toast({
        title: "ABHA ID Verified Successfully!",
        description: `Welcome back, ${profile.name}! Your health profile has been loaded.`,
      });
    } catch (error) {
      console.error('Verification error:', error);
      toast({
        title: "Verification Failed",
        description: "Failed to verify ABHA ID. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="pt-16">
      <section className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 fade-in">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Enter Your ABHA ID</h1>
            <p className="text-xl text-gray-600">Access your health profile and government schemes</p>
          </div>

          {/* ABHA ID Input Section */}
          {!isVerified && (
            <Card className="glassmorphism rounded-2xl max-w-2xl mx-auto mb-8 slide-up">
              <CardContent className="p-8 text-center">
                <Shield className="text-medilinkx-blue h-16 w-16 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">Ayushman Bharat Health Account</h3>
                <p className="text-gray-600 mb-6">
                  Enter your 14-digit ABHA ID to access your health profile and available government schemes
                </p>
                
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <Input
                      placeholder="Enter your 14-digit ABHA ID"
                      value={abhaIdInput}
                      onChange={(e) => setAbhaIdInput(e.target.value)}
                      className="flex-1 text-center text-lg font-mono"
                      maxLength={14}
                    />
                    <Button 
                      onClick={handleVerifyAbhaId}
                      disabled={isVerifying || abhaIdInput.length !== 14}
                      className="bg-medilinkx-blue hover:bg-blue-700 px-6 font-semibold"
                    >
                      {isVerifying ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Verifying...
                        </>
                      ) : (
                        <>
                          <Search className="mr-2 h-5 w-5" />
                          Verify
                        </>
                      )}
                    </Button>
                  </div>
                  
                  <p className="text-sm text-gray-500 mb-4">
                    Example: 12345678901234
                  </p>
                  
                  {/* Link to get ABHA ID from official website */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-3">
                      Don't have an ABHA ID?
                    </p>
                    <a
                      href="https://abha.abdm.gov.in/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-medilinkx-blue hover:text-blue-700 font-semibold text-sm transition-colors"
                    >
                      <Shield className="h-4 w-4" />
                      Get Your ABHA ID from Official Website
                      <ArrowRight className="h-4 w-4" />
                    </a>
                    <p className="text-xs text-gray-500 mt-2">
                      Visit the official Ayushman Bharat Digital Mission portal to create your ABHA ID
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* What is ABHA ID Section */}
          <Card className="glassmorphism rounded-2xl mb-8 slide-up">
            <CardContent className="p-8">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <Info className="text-medilinkx-blue mr-3 h-8 w-8" />
                What is ABHA ID?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-6">
                  <h4 className="font-semibold text-gray-700 mb-3">Government Health ID</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    ABHA (Ayushman Bharat Health Account) is a unique 14-digit identification number 
                    that serves as your digital health identity. It enables you to access various 
                    government health schemes and services.
                  </p>
                </div>
                <div className="bg-white rounded-lg p-6">
                  <h4 className="font-semibold text-gray-700 mb-3">Benefits</h4>
                  <ul className="text-gray-600 text-sm space-y-2">
                    <li>• Access to government health schemes</li>
                    <li>• Digital health records</li>
                    <li>• Seamless healthcare services</li>
                    <li>• Financial assistance for medical expenses</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Where to Find Your ABHA ID */}
          <Card className="glassmorphism rounded-2xl mb-8 slide-up">
            <CardContent className="p-8">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6">Where to Find Your ABHA ID?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg p-6 text-center">
                  <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-blue-600">1</span>
                  </div>
                  <h4 className="font-semibold text-gray-700 mb-2">Government Portal</h4>
                  <p className="text-gray-600 text-sm">
                    Visit the official Ayushman Bharat Digital Mission portal
                  </p>
                </div>
                <div className="bg-white rounded-lg p-6 text-center">
                  <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-green-600">2</span>
                  </div>
                  <h4 className="font-semibold text-gray-700 mb-2">Healthcare Provider</h4>
                  <p className="text-gray-600 text-sm">
                    Ask your registered healthcare provider or hospital
                  </p>
                </div>
                <div className="bg-white rounded-lg p-6 text-center">
                  <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-orange-600">3</span>
                  </div>
                  <h4 className="font-semibold text-gray-700 mb-2">Government Office</h4>
                  <p className="text-gray-600 text-sm">
                    Visit your local government health office
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Verified User Profile */}
          {isVerified && userProfile && (
            <Card className="glassmorphism rounded-2xl slide-up">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                  <UserCheck className="text-medilinkx-green mr-3 h-8 w-8" />
                  Government Verified Profile
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-white rounded-lg p-6">
                    <h4 className="font-semibold text-gray-700 mb-4">Personal Information</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Name:</span>
                        <span className="font-semibold text-gray-800">{userProfile.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">ABHA ID:</span>
                        <span className="font-mono font-semibold text-gray-800">{userProfile.abha_id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date of Birth:</span>
                        <span className="font-semibold text-gray-800">{userProfile.dateOfBirth}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Address:</span>
                        <span className="font-semibold text-gray-800 text-right max-w-xs">{userProfile.address}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-6">
                    <h4 className="font-semibold text-gray-700 mb-4">Wallet Information</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Wallet Balance:</span>
                        <span className="font-semibold text-medilinkx-blue">${userProfile.walletBalance.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ethereum Address:</span>
                        <span className="font-mono text-xs font-semibold text-gray-800">
                          {userProfile.coinbaseAddress.substring(0, 8)}...{userProfile.coinbaseAddress.substring(userProfile.coinbaseAddress.length - 6)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <Link href="/wallet-setup">
                    <Button 
                      className="bg-medilinkx-green hover:bg-green-700 px-8 py-3 font-semibold"
                    >
                      Continue to Wallet Setup
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <p className="text-sm text-gray-600 mt-2">
                    Set up your Coinbase CDP wallet to access healthcare schemes
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Government Verified Badge */}
          <Card className="glassmorphism rounded-2xl slide-up">
            <CardContent className="p-8 text-center">
              <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Shield className="h-12 w-12 text-green-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Government Verified</h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                This application is designed to work with the official Ayushman Bharat Digital Mission. 
                Your ABHA ID verification ensures secure access to government health schemes and 
                financial assistance programs.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
