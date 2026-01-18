import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Search, Brain, UserCheck, Heart, Shield, Users, ArrowRight, CheckCircle, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { LocalStorage, mockSchemes } from "@/lib/storage";

export default function AiRecommendation() {
  const [healthIdInput, setHealthIdInput] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [patientProfile, setPatientProfile] = useState<any>(null);
  const [autoAppliedSchemes, setAutoAppliedSchemes] = useState<Set<string>>(new Set());
  const [hasAutoLoaded, setHasAutoLoaded] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = async (providedHealthId?: string) => {
    const abhaId = (providedHealthId ?? healthIdInput).trim();
    if (!abhaId) {
      toast({
        title: "Error",
        description: "Please enter a valid ABHA ID",
        variant: "destructive",
      });
      return;
    }

    try {
      // Fetch user profile from API
      const response = await fetch(`/api/wallet/user/${abhaId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          toast({
            title: "User Not Found",
            description: "This ABHA ID is not registered. Please register first or use a valid ABHA ID.",
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
      
      // Calculate age from dateOfBirth
      const birthYear = new Date(user.dateOfBirth || '1988-05-15').getFullYear();
      const age = new Date().getFullYear() - birthYear;
      
      // Create profile from API data
      const profile = {
        id: abhaId,
        patientName: user.name,
        dateOfBirth: user.dateOfBirth || "1988-05-15",
        nationalId: abhaId,
        bloodGroup: user.bloodGroup || "Not specified",
        medicalConditions: user.medicalConditions || "None",
        emergencyContact: user.emergencyContact || "Not provided",
        age: age,
        createdAt: new Date(),
      };

      setPatientProfile(profile);
      setShowProfile(true);

      // Store user profile in localStorage for other pages
      localStorage.setItem('abha_id', abhaId);
      localStorage.setItem('user_profile', JSON.stringify(user));

      // Show recommendations after a delay
      setTimeout(() => {
        setShowRecommendations(true);
        toast({
          title: "AI Analysis Completed",
          description: "Your personalized recommendations are ready!",
        });
      }, 1500);
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze ABHA ID. Please try again or ensure the server is running.",
        variant: "destructive",
      });
    }
  };

  // Auto-fill ABHA ID from earlier steps (wallet setup / create health ID)
  useEffect(() => {
    if (hasAutoLoaded) return;
    const storedAbha = localStorage.getItem("abha_id");
    if (storedAbha) {
      setHealthIdInput(storedAbha);
      setHasAutoLoaded(true);
      handleAnalyze(storedAbha);
    }
  }, [hasAutoLoaded]);

  const handleAutoApply = (schemeId: string, schemeName: string) => {
    // Add to auto-applied schemes
    setAutoAppliedSchemes(prev => new Set([...prev, schemeId]));
    
    // Store auto-applied schemes in localStorage for the claim-schemes page
    const currentApplied = Array.from(autoAppliedSchemes);
    const updatedApplied = [...currentApplied, schemeId];
    localStorage.setItem('auto_applied_schemes', JSON.stringify(updatedApplied));
    
    // Store the scheme details for immediate access in voucher wallet
    const schemeDetails = mockSchemes.find(scheme => scheme.id === schemeId);
    if (schemeDetails) {
      const approvedScheme = {
        id: schemeDetails.id,
        name: schemeDetails.name,
        description: schemeDetails.description,
        amount: schemeDetails.coverage / 100, // Convert to USDC (divide by 100 for demo)
        status: 'approved' as const,
        approvalDate: new Date().toISOString().split('T')[0],
        provider: 'Government Health Scheme',
        estimatedBenefit: `$${schemeDetails.coverage.toLocaleString()}`,
        matchScore: schemeDetails.matchPercentage
      };
      
      const existingApproved = JSON.parse(localStorage.getItem('approved_schemes') || '[]');
      const updatedApproved = [...existingApproved, approvedScheme];
      localStorage.setItem('approved_schemes', JSON.stringify(updatedApproved));
    }
    
    toast({
      title: "Auto-Application Successful!",
      description: `Successfully applied to ${schemeName}`,
    });
  };

  const handleAutoApplyAll = () => {
    // Auto-apply to all schemes
    const allSchemeIds = mockSchemes.map(scheme => scheme.id);
    setAutoAppliedSchemes(new Set(allSchemeIds));
    
    // Store all auto-applied schemes in localStorage
    localStorage.setItem('auto_applied_schemes', JSON.stringify(allSchemeIds));
    
    // Store all scheme details for immediate access
    const allApprovedSchemes = mockSchemes.map(scheme => ({
      id: scheme.id,
      name: scheme.name,
      description: scheme.description,
      amount: scheme.coverage / 100,
      status: 'approved' as const,
      approvalDate: new Date().toISOString().split('T')[0],
      provider: 'Government Health Scheme',
      estimatedBenefit: `$${scheme.coverage.toLocaleString()}`,
      matchScore: scheme.matchPercentage
    }));
    
    localStorage.setItem('approved_schemes', JSON.stringify(allApprovedSchemes));
    
    toast({
      title: "Bulk Auto-Application Complete!",
      description: `Successfully applied to ${allSchemeIds.length} schemes.`,
    });
  };

  const getMatchColor = (percentage: number) => {
    if (percentage >= 90) return "text-medilinkx-green border-medilinkx-green";
    if (percentage >= 80) return "text-medilinkx-blue border-medilinkx-blue";
    return "text-medilinkx-orange border-medilinkx-orange";
  };

  const getMatchBadgeColor = (percentage: number) => {
    if (percentage >= 90) return "bg-medilinkx-green";
    if (percentage >= 80) return "bg-medilinkx-blue";
    return "bg-medilinkx-orange";
  };

  return (
    <div className="pt-16">
      <section className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 fade-in">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">AI-Powered Health Recommendations</h1>
            <p className="text-xl text-gray-600">Get personalized scheme recommendations based on your health profile</p>
          </div>

          {/* HealthID Input Section */}
          <Card className="glassmorphism rounded-2xl max-w-2xl mx-auto mb-8 slide-up">
            <CardContent className="p-8 text-center">
              <Search className="text-medilinkx-blue h-12 w-12 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Enter Your ABHA ID</h3>
              <div className="flex gap-3">
                <Input
                  placeholder="Enter your ABHA ID"
                  value={healthIdInput}
                  onChange={(e) => setHealthIdInput(e.target.value)}
                  className="flex-1"
                  data-testid="input-healthid"
                />
                <Button 
                  onClick={handleAnalyze}
                  className="bg-medilinkx-blue hover:bg-blue-700 px-6 font-semibold"
                  data-testid="button-analyze"
                >
                  <Brain className="mr-2 h-5 w-5" />
                  Analyze
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Patient Profile Section */}
          {showProfile && patientProfile && (
            <Card className="glassmorphism rounded-2xl mb-8 slide-up">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                  <UserCheck className="text-medilinkx-blue mr-3 h-8 w-8" />
                  Patient Profile
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-semibold text-gray-700 mb-2">Basic Information</h4>
                    <p className="text-gray-600"><strong>Name:</strong> {patientProfile.patientName}</p>
                    <p className="text-gray-600"><strong>Age:</strong> {patientProfile.age || (new Date().getFullYear() - new Date(patientProfile.dateOfBirth).getFullYear())} years</p>
                    <p className="text-gray-600"><strong>Blood Group:</strong> {patientProfile.bloodGroup}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-semibold text-gray-700 mb-2">Health Status</h4>
                    <p className="text-gray-600"><strong>Conditions:</strong> {patientProfile.medicalConditions || 'None'}</p>
                    <p className="text-gray-600">
                      <strong>Risk Level:</strong> {' '}
                      <span className={`font-semibold ${
                        (patientProfile.medicalConditions?.toLowerCase().includes('heart') || 
                         patientProfile.medicalConditions?.toLowerCase().includes('emergency')) 
                          ? 'text-red-600' 
                          : patientProfile.medicalConditions?.toLowerCase().includes('diabetes')
                          ? 'text-orange-600'
                          : 'text-green-600'
                      }`}>
                        {(patientProfile.medicalConditions?.toLowerCase().includes('heart') || 
                          patientProfile.medicalConditions?.toLowerCase().includes('emergency')) 
                          ? 'High' 
                          : patientProfile.medicalConditions?.toLowerCase().includes('diabetes')
                          ? 'Medium'
                          : 'Low'}
                      </span>
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-semibold text-gray-700 mb-2">Eligibility Score</h4>
                    <div className="flex items-center">
                      <div className={`text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mr-3 ${
                        patientProfile.age && patientProfile.age > 50 
                          ? 'bg-green-600' 
                          : patientProfile.medicalConditions?.toLowerCase().includes('diabetes')
                          ? 'bg-green-600'
                          : 'bg-blue-600'
                      }`}>
                        {patientProfile.age && patientProfile.age > 50 
                          ? 92 
                          : patientProfile.medicalConditions?.toLowerCase().includes('diabetes')
                          ? 95
                          : 85}
                      </div>
                      <span className="text-medilinkx-green font-semibold">Highly Eligible</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* AI Recommendations Section */}
          {showRecommendations && (
            <Card className="glassmorphism rounded-2xl slide-up">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                  <Brain className="text-medilinkx-green mr-3 h-8 w-8" />
                  AI-Generated Recommendations
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockSchemes.map((scheme) => {
                    // Calculate dynamic match percentage based on user's medical conditions
                    let matchPercentage = scheme.matchPercentage;
                    if (patientProfile?.medicalConditions) {
                      const conditions = patientProfile.medicalConditions.toLowerCase();
                      const age = patientProfile.age || 35;
                      
                      // Diabetes care matching
                      if (scheme.type === 'diabetes-care' && conditions.includes('diabetes')) {
                        matchPercentage = 95;
                      } else if (scheme.type === 'diabetes-care') {
                        matchPercentage = 60;
                      }
                      
                      // Emergency care matching
                      if (scheme.type === 'emergency-care' && (conditions.includes('emergency') || conditions.includes('heart') || conditions.includes('asthma'))) {
                        matchPercentage = 92;
                      } else if (scheme.type === 'emergency-care') {
                        matchPercentage = 70;
                      }
                      
                      // Family care matching
                      if (scheme.type === 'family-care' && age > 30) {
                        matchPercentage = 85;
                      } else if (scheme.type === 'family-care') {
                        matchPercentage = 65;
                      }
                      
                      // General health matching
                      if (scheme.type === 'general-health' && age > 50) {
                        matchPercentage = 90;
                      } else if (scheme.type === 'general-health' && conditions === 'none' || conditions === 'general health') {
                        matchPercentage = 87;
                      }
                    }
                    
                    const matchColor = getMatchColor(matchPercentage);
                    const badgeColor = getMatchBadgeColor(matchPercentage);
                    const SchemeIcon = scheme.type === 'diabetes-care' ? Heart : 
                                     scheme.type === 'general-health' ? Shield : 
                                     scheme.type === 'emergency-care' ? Shield : Users;
                    const isApplied = autoAppliedSchemes.has(scheme.id);

                    return (
                      <div 
                        key={scheme.id}
                        className={`bg-white rounded-xl p-6 border-l-4 ${matchColor} hover:shadow-lg transition-shadow`}
                        data-testid={`recommendation-${scheme.type}`}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <span className={`${badgeColor} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
                            {matchPercentage}% Match
                          </span>
                          {isApplied ? (
                            <CheckCircle className="h-6 w-6 text-green-600" />
                          ) : (
                            <SchemeIcon className={`h-6 w-6 ${matchColor.split(' ')[0]}`} />
                          )}
                        </div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-2">{scheme.name}</h4>
                        <p className="text-gray-600 mb-3 text-sm">{scheme.description}</p>
                        <div className="space-y-2 text-sm text-gray-500 mb-4">
                          <p>💰 Coverage: ${scheme.coverage.toLocaleString()}/year</p>
                          <p>⏱️ Processing: {scheme.processingTime}</p>
                          <p>🏥 Network: {scheme.networkHospitals}+ hospitals</p>
                        </div>
                        
                        <div className="flex gap-2">
                          {!isApplied ? (
                            <Button
                              size="sm"
                              onClick={() => handleAutoApply(scheme.id, scheme.name)}
                              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                            >
                              <CheckCircle className="mr-1 h-4 w-4" />
                              Auto-Apply
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              className="flex-1 bg-green-600 text-white"
                              disabled
                            >
                              <CheckCircle className="mr-1 h-4 w-4" />
                              Applied
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="text-center mt-8 space-y-4">
                  {/* Bulk Auto-Apply Button */}
                  {autoAppliedSchemes.size === 0 && (
                    <div>
                      <Button 
                        onClick={handleAutoApplyAll}
                        className="bg-orange-600 hover:bg-orange-700 px-8 py-3 font-semibold mr-4"
                      >
                        <Brain className="mr-2 h-5 w-5" />
                        Auto-Apply to All Schemes
                      </Button>
                    </div>
                  )}

                  {/* Continue to Voucher System */}
                  {autoAppliedSchemes.size > 0 && (
                    <div>
                      <Link href="/claim-schemes">
                        <Button 
                          className="bg-medilinkx-green hover:bg-green-700 px-8 py-3 font-semibold"
                        >
                          <Wallet className="mr-2 h-5 w-5" />
                          Continue to Voucher Wallet ({autoAppliedSchemes.size} Applied)
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                      </Link>
                      <p className="text-sm text-gray-600 mt-2">
                        Convert your approved schemes to USDC vouchers for hospital payments
                      </p>
                    </div>
                  )}

                  {/* View All Schemes */}
                  <div>
                    <Link href="/schemes">
                      <Button 
                        variant="outline"
                        className="px-8 py-3 font-semibold"
                      >
                        View All Available Schemes
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}

