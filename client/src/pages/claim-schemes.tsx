import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Wallet, CheckCircle, ArrowRight, DollarSign, Calendar, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface ApprovedScheme {
  id: string;
  name: string;
  description: string;
  amount: number;
  status: 'approved';
  approvalDate: string;
  provider: string;
  estimatedBenefit: string;
  matchScore: number;
}

export default function ClaimSchemes() {
  const [approvedSchemes, setApprovedSchemes] = useState<ApprovedScheme[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [convertedVouchers, setConvertedVouchers] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    // Load approved schemes from localStorage (set by AI recommendation page)
    const loadApprovedSchemes = () => {
      try {
        // Check if user has approved schemes in localStorage (from auto-apply)
        const approvedSchemesData = localStorage.getItem('approved_schemes');
        
        if (approvedSchemesData) {
          // Use the schemes that were auto-applied and stored
          const approvedSchemes: ApprovedScheme[] = JSON.parse(approvedSchemesData);
          setApprovedSchemes(approvedSchemes);
        } else {
          // Fallback: Check if user has auto-applied schemes in localStorage
          const autoAppliedSchemes = localStorage.getItem('auto_applied_schemes');
          
          if (autoAppliedSchemes) {
            // Use the schemes that were actually auto-applied
            const appliedSchemeIds = JSON.parse(autoAppliedSchemes);
            
                         // Create mock approved schemes based on applied IDs
             const mockApprovedSchemes: ApprovedScheme[] = [
               {
                 id: 'diabetes-care',
                 name: 'Diabetes Care Plus',
                 description: 'Comprehensive diabetes management program',
                 amount: 50, // $50 USDC
                 status: 'approved' as const,
                 approvalDate: new Date().toISOString().split('T')[0],
                 provider: 'Government Health Scheme',
                 estimatedBenefit: '$5,000',
                 matchScore: 95
               },
               {
                 id: 'general-health',
                 name: 'General Health Shield',
                 description: 'Basic health insurance coverage',
                 amount: 30, // $30 USDC
                 status: 'approved' as const,
                 approvalDate: new Date().toISOString().split('T')[0],
                 provider: 'Government Health Scheme',
                 estimatedBenefit: '$3,000',
                 matchScore: 87
               },
               {
                 id: 'family-care',
                 name: 'Family Care Package',
                 description: 'Extended family health coverage',
                 amount: 80, // $80 USDC
                 status: 'approved' as const,
                 approvalDate: new Date().toISOString().split('T')[0],
                 provider: 'Government Health Scheme',
                 estimatedBenefit: '$8,000',
                 matchScore: 78
               }
                          ].filter(scheme => appliedSchemeIds.includes(scheme.id)) as ApprovedScheme[];
             
             setApprovedSchemes(mockApprovedSchemes);
          } else {
            // Fallback to mock data
            const mockSchemes: ApprovedScheme[] = [
              {
                id: 'pmjay-001',
                name: 'Ayushman Bharat - PM-JAY',
                description: 'Health insurance coverage up to ₹5 lakh per family per year',
                amount: 5000,
                status: 'approved',
                approvalDate: '2024-01-15',
                provider: 'Government of India',
                estimatedBenefit: '$6,250',
                matchScore: 92
              },
              {
                id: 'rsby-005',
                name: 'Rashtriya Swasthya Bima Yojana',
                description: 'Health insurance for BPL families',
                amount: 300,
                status: 'approved',
                approvalDate: '2024-01-16',
                provider: 'Government of India',
                estimatedBenefit: '$375',
                matchScore: 88
              }
            ];
            setApprovedSchemes(mockSchemes);
          }
        }
      } catch (error) {
        console.error('Error loading approved schemes:', error);
        // Fallback to mock data
        const mockSchemes: ApprovedScheme[] = [
          {
            id: 'pmjay-001',
            name: 'Ayushman Bharat - PM-JAY',
            description: 'Health insurance coverage up to ₹5 lakh per family per year',
            amount: 5000,
            status: 'approved',
            approvalDate: '2024-01-15',
            provider: 'Government of India',
            estimatedBenefit: '$6,250',
            matchScore: 92
          }
        ];
        setApprovedSchemes(mockSchemes);
      }
    };

    loadApprovedSchemes();
  }, []);

  const handleConvertToVoucher = async (schemeId: string) => {
    setIsConverting(true);
    
    try {
      const scheme = approvedSchemes.find(s => s.id === schemeId);
      if (!scheme) return;

      // Simulate voucher creation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add to converted vouchers
      setConvertedVouchers(prev => new Set([...prev, schemeId]));
      
      // Store created vouchers in localStorage for the next step
      const existingVouchers = JSON.parse(localStorage.getItem('created_vouchers') || '[]');
      const newVoucher = {
        id: `voucher-${schemeId}`,
        schemeId: scheme.id,
        schemeName: scheme.name,
        amount: scheme.amount,
        status: 'active',
        createdAt: new Date().toISOString(),
        provider: scheme.provider,
        estimatedBenefit: scheme.estimatedBenefit
      };
      
      const updatedVouchers = [...existingVouchers, newVoucher];
      localStorage.setItem('created_vouchers', JSON.stringify(updatedVouchers));
      
      toast({
        title: "Voucher Created Successfully!",
        description: `Created ${scheme.amount} USDC voucher for ${scheme.name}`,
      });
    } catch (error) {
      console.error('Error converting to voucher:', error);
      toast({
        title: "Voucher Creation Failed",
        description: "Failed to create voucher. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConverting(false);
    }
  };

  const handleConvertAll = async () => {
    setIsConverting(true);
    
    try {
      const unconvertedSchemes = approvedSchemes.filter(scheme => !convertedVouchers.has(scheme.id));
      
      for (const scheme of unconvertedSchemes) {
        await handleConvertToVoucher(scheme.id);
      }
      
      toast({
        title: "All Vouchers Created!",
        description: `Successfully created ${unconvertedSchemes.length} vouchers.`,
      });
    } catch (error) {
      console.error('Error converting all to vouchers:', error);
      toast({
        title: "Bulk Conversion Failed",
        description: "Some vouchers failed to create. Please check individually.",
        variant: "destructive",
      });
    } finally {
      setIsConverting(false);
    }
  };

  const getMatchColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 80) return "text-blue-600";
    return "text-orange-600";
  };

  const getMatchBadgeColor = (percentage: number) => {
    if (percentage >= 90) return "bg-green-100 text-green-800";
    if (percentage >= 80) return "bg-blue-100 text-blue-800";
    return "bg-orange-100 text-orange-800";
  };

  return (
    <div className="pt-16">
      <section className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 fade-in">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Voucher Wallet</h1>
            <p className="text-xl text-gray-600">Convert your approved schemes to USDC vouchers for hospital payments</p>
          </div>

          {/* Summary Card */}
          <Card className="glassmorphism rounded-2xl mb-8 slide-up">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl text-gray-800">
                <Wallet className="mr-3 h-8 w-8 text-medilinkx-blue" />
                Approved Schemes Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-medilinkx-blue">{approvedSchemes.length}</div>
                  <div className="text-sm text-gray-600">Total Approved</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {approvedSchemes.filter(s => convertedVouchers.has(s.id)).length}
                  </div>
                  <div className="text-sm text-gray-600">Vouchers Created</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">
                    {approvedSchemes.filter(s => !convertedVouchers.has(s.id)).length}
                  </div>
                  <div className="text-sm text-gray-600">Pending Conversion</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">
                    ${approvedSchemes.reduce((sum, s) => sum + s.amount, 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Total Value</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Approved Schemes */}
          <Card className="glassmorphism rounded-2xl slide-up">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-800">Approved Schemes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {approvedSchemes.map((scheme) => {
                  const isConverted = convertedVouchers.has(scheme.id);
                  const matchColor = getMatchColor(scheme.matchScore);
                  const badgeColor = getMatchBadgeColor(scheme.matchScore);

                  return (
                    <div 
                      key={scheme.id}
                      className={`bg-white rounded-xl p-6 border-l-4 ${isConverted ? 'border-green-500' : 'border-blue-500'} hover:shadow-lg transition-shadow`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className={`${badgeColor} px-3 py-1 rounded-full text-sm font-semibold`}>
                          {scheme.matchScore}% Match
                        </span>
                        {isConverted ? (
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        ) : (
                          <DollarSign className="h-6 w-6 text-blue-600" />
                        )}
                      </div>
                      
                      <h4 className="text-lg font-semibold text-gray-800 mb-2">{scheme.name}</h4>
                      <p className="text-gray-600 mb-3 text-sm">{scheme.description}</p>
                      
                      <div className="space-y-2 text-sm text-gray-500 mb-4">
                        <p className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-2" />
                          Voucher Value: ${scheme.amount} USDC
                        </p>
                        <p className="flex items-center">
                          <Building className="h-4 w-4 mr-2" />
                          Provider: {scheme.provider}
                        </p>
                        <p className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          Approved: {scheme.approvalDate}
                        </p>
                        <p className="text-green-600 font-semibold">
                          Estimated Benefit: {scheme.estimatedBenefit}
                        </p>
                      </div>
                      
                      <div className="flex gap-2">
                        {!isConverted ? (
                          <Button
                            size="sm"
                            onClick={() => handleConvertToVoucher(scheme.id)}
                            disabled={isConverting}
                            className="flex-1 bg-medilinkx-blue hover:bg-blue-700 text-white"
                          >
                            {isConverting ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Converting...
                              </>
                            ) : (
                              <>
                                <DollarSign className="mr-1 h-4 w-4" />
                                Convert to Voucher
                              </>
                            )}
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            className="flex-1 bg-green-600 text-white"
                            disabled
                          >
                            <CheckCircle className="mr-1 h-4 w-4" />
                            Voucher Created
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="text-center mt-8 space-y-4">
                {/* Bulk Convert Button */}
                {approvedSchemes.filter(s => !convertedVouchers.has(s.id)).length > 0 && (
                  <div>
                    <Button 
                      onClick={handleConvertAll}
                      disabled={isConverting}
                      className="bg-orange-600 hover:bg-orange-700 px-8 py-3 font-semibold mr-4"
                    >
                      {isConverting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Converting All...
                        </>
                      ) : (
                        <>
                          <DollarSign className="mr-2 h-5 w-5" />
                          Convert All to Vouchers
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {/* Continue to Hospital Payment */}
                {convertedVouchers.size > 0 && (
                  <div>
                    <Link href="/pay-hospital">
                      <Button 
                        className="bg-medilinkx-green hover:bg-green-700 px-8 py-3 font-semibold"
                      >
                        <Wallet className="mr-2 h-5 w-5" />
                        Continue to Hospital Payment ({convertedVouchers.size} Vouchers)
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                    <p className="text-sm text-gray-600 mt-2">
                      Use your vouchers to pay for hospital services
                    </p>
                  </div>
                )}

                {/* Back to AI Recommendations */}
                <div>
                  <Link href="/ai-recommendation">
                    <Button 
                      variant="outline"
                      className="px-8 py-3 font-semibold"
                    >
                      Back to AI Recommendations
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
