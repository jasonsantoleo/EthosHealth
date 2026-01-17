import { useState, useEffect } from "react";
import { Link } from "wouter";
import { CheckCircle, FileText, Download, Wallet, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { LocalStorage } from "@/lib/storage";
import { generatePDFReceipt, downloadPDFBlob } from "@/lib/pdf-utils";

export default function Receipt() {
  const [transactionData, setTransactionData] = useState<any>(null);
  const [healthId, setHealthId] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Load transaction and health data
    const lastTransaction = LocalStorage.getLastTransaction();
    const storedHealthId = LocalStorage.getHealthId();
    const abhaId = localStorage.getItem("abha_id");
    
    if (lastTransaction) {
      setTransactionData(lastTransaction);
    }
    
    if (storedHealthId) {
      setHealthId(storedHealthId);
    } else if (abhaId) {
      // Fallback: build a minimal HealthId from stored ABHA ID so receipts work
      setHealthId({
        id: abhaId,
        patientName: lastTransaction?.patientName || "ABHA User",
        dateOfBirth: "",
        nationalId: abhaId,
        bloodGroup: "",
        gender: "",
        medicalConditions: "",
        emergencyContact: "",
        createdAt: new Date(),
      } as any);
    }
  }, []);

  const handleDownloadPDF = () => {
    if (!transactionData || !healthId) {
      toast({
        title: "Error",
        description: "Missing transaction data for PDF generation",
        variant: "destructive",
      });
      return;
    }

    // Generate PDF receipt
    downloadPDFBlob({
      healthId,
      transaction: transactionData,
      hospitalName: transactionData.hospitalName,
      schemeName: getSchemeName(transactionData.voucherId),
      amount: transactionData.amount,
      transactionId: transactionData.transactionId,
      date: new Date(transactionData.createdAt).toLocaleString(),
    });

    toast({
      title: "Download Started",
      description: "Your PDF receipt is being downloaded",
    });
  };

  const getSchemeName = (voucherId: string) => {
    if (voucherId.includes('diabetes')) return 'Diabetes Care Plus';
    if (voucherId.includes('general')) return 'General Health Shield';
    if (voucherId.includes('emergency')) return 'Emergency Care Voucher';
    return 'Health Scheme';
  };

  if (!transactionData) {
    return (
      <div className="pt-16 min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <Card className="glassmorphism rounded-2xl max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">No Transaction Found</h2>
            <p className="text-gray-600 mb-6">Complete a voucher transaction to view your receipt.</p>
            <Link href="/wallet">
              <Button className="bg-medilinkx-blue hover:bg-blue-700">
                Go to Wallet
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="pt-16">
      <section className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 fade-in">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Payment Completed Successfully</h1>
            <p className="text-xl text-gray-600">Your health voucher has been processed and payment completed</p>
          </div>

          {/* Success Message */}
          <Card className="glassmorphism rounded-2xl mb-8 slide-up">
            <CardContent className="p-8 text-center">
              <div className="bg-medilinkx-green bg-opacity-10 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="text-medilinkx-green h-16 w-16" />
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-4">Transaction Successful!</h3>
              <p className="text-lg text-gray-600 mb-6">
                Your health voucher payment has been successfully processed and transferred to the hospital.
              </p>
              <div className="bg-white rounded-lg p-4 mb-6 text-left max-w-md mx-auto">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><strong>Transaction ID:</strong></div>
                  <div 
                    className="font-mono text-medilinkx-blue" 
                    data-testid="transaction-id"
                  >
                    {transactionData.transactionId}
                  </div>
                  <div><strong>Amount:</strong></div>
                  <div 
                    className="text-medilinkx-green font-semibold" 
                    data-testid="transaction-amount"
                  >
                    ${transactionData.amount.toFixed(2)}
                  </div>
                  <div><strong>Hospital:</strong></div>
                  <div data-testid="selected-hospital">{transactionData.hospitalName}</div>
                  <div><strong>Status:</strong></div>
                  <div className="text-medilinkx-green font-semibold">✅ Completed</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* PDF Receipt Preview */}
          <Card className="glassmorphism rounded-2xl slide-up">
            <CardContent className="p-8">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center flex items-center justify-center">
                <FileText className="text-medilinkx-red mr-3 h-8 w-8" />
                Digital Receipt
              </h3>
              
              {/* Receipt Preview */}
              <div className="bg-white rounded-xl p-8 max-w-lg mx-auto border-2 border-gray-200 mb-8">
                <div className="text-center mb-6">
                  <div className="text-3xl mb-3">🩺</div>
                  <h2 className="text-2xl font-bold text-gray-800">MediLinkX</h2>
                  <p className="text-gray-600">Health Payment Receipt</p>
                </div>
                
                <div className="border-t border-b border-gray-200 py-4 my-4">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="font-semibold">Patient HealthID:</div>
                    <div className="font-mono text-medilinkx-blue text-xs break-all">
                      {healthId?.id || '0x7A2F8B9C4E6D1A5F8B9C2E6D'}
                    </div>
                    
                    <div className="font-semibold">Patient Name:</div>
                    <div>{healthId?.patientName || 'John Doe'}</div>
                    
                    <div className="font-semibold">Hospital:</div>
                    <div data-testid="receipt-hospital">{transactionData.hospitalName}</div>
                    
                    <div className="font-semibold">Scheme:</div>
                    <div data-testid="receipt-scheme">{getSchemeName(transactionData.voucherId)}</div>
                    
                    <div className="font-semibold">Voucher Amount:</div>
                    <div 
                      className="text-medilinkx-green font-semibold" 
                      data-testid="receipt-amount"
                    >
                      ${transactionData.amount.toFixed(2)}
                    </div>
                    
                    <div className="font-semibold">Transaction ID:</div>
                    <div 
                      className="font-mono text-xs break-all" 
                      data-testid="receipt-txn"
                    >
                      {transactionData.transactionId}
                    </div>
                    
                    <div className="font-semibold">Date & Time:</div>
                    <div data-testid="receipt-date">
                      {new Date(transactionData.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-700 mb-2">AI Recommendation Summary:</h4>
                  <p className="text-gray-600 text-sm">
                    Patient matched 95% with {getSchemeName(transactionData.voucherId)} scheme based on medical history and current health profile. 
                    Automatic approval granted for comprehensive healthcare management services.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="bg-medilinkx-green bg-opacity-10 text-medilinkx-green px-4 py-2 rounded-full inline-flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    <span className="font-semibold">Status: ✅ Completed</span>
                  </div>
                </div>
                
                <div className="text-center mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">Generated by MediLinkX Blockchain Platform</p>
                  <p className="text-xs text-gray-500">Verified on Ethereum Network</p>
                </div>
              </div>
              
              {/* Download Buttons */}
              <div className="text-center space-y-4">
                <Button 
                  onClick={handleDownloadPDF}
                  className="bg-medilinkx-red hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold mr-4"
                  data-testid="button-download-pdf"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download PDF Receipt
                </Button>
                <Link href="/wallet">
                  <Button 
                    className="bg-medilinkx-blue hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold"
                    data-testid="button-back-to-wallet"
                  >
                    <Wallet className="mr-2 h-5 w-5" />
                    Back to Wallet
                  </Button>
                </Link>
              </div>
              
              {/* Next Steps */}
              <div className="mt-8 bg-blue-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <Lightbulb className="text-medilinkx-orange mr-2 h-5 w-5" />
                  What's Next?
                </h4>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <CheckCircle className="text-medilinkx-green mr-2 mt-1 h-4 w-4 flex-shrink-0" />
                    Visit the selected hospital with your HealthID and receipt
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="text-medilinkx-green mr-2 mt-1 h-4 w-4 flex-shrink-0" />
                    Present your digital receipt for verification
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="text-medilinkx-green mr-2 mt-1 h-4 w-4 flex-shrink-0" />
                    Receive your healthcare services as per the scheme benefits
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
