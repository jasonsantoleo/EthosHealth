import { Link } from "wouter";
import { 
  Shield, 
  Wallet, 
  Bot, 
  FileText, 
  Download, 
  CheckCircle, 
  Users, 
  TrendingUp,
  Award,
  Clock,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Star,
  Heart,
  Zap,
  Globe,
  Lock,
  Smartphone
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <Heart className="w-12 h-12 text-red-400 mr-3" />
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                HealthChainAI
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto mb-8 leading-relaxed">
              End-to-end healthcare management: from ABHA ID verification to instant hospital payments
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/create-healthid">
                <button className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-50 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  Start Workflow - Enter ABHA ID
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
              <Link href="#how-it-works">
                <button className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300 flex items-center gap-2">
                  Learn How It Works
                  <Bot className="w-5 h-5" />
                </button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-blue-400/20 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-blue-400/20 rounded-full blur-lg"></div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">50K+</h3>
              <p className="text-gray-600">Active Users</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">₹2.5Cr+</h3>
              <p className="text-gray-600">Vouchers Issued</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">95%</h3>
              <p className="text-gray-600">Success Rate</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">24/7</h3>
              <p className="text-gray-600">Support Available</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How HealthChainAI Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our streamlined 7-step process ensures seamless healthcare access from ABHA ID verification to instant hospital payments
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">Enter ABHA ID</h3>
              <p className="text-gray-600 text-center mb-6">
                Verify your Ayushman Bharat Health Account ID for secure access
              </p>
              <div className="flex items-center justify-center text-blue-600">
                <Shield className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Government Verified</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">Wallet Setup</h3>
              <p className="text-gray-600 text-center mb-6">
                Connect your Ethereum wallet (MetaMask/WalletConnect) on Sepolia
              </p>
              <div className="flex items-center justify-center text-green-600">
                <Wallet className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Crypto Ready</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">AI Recommendation</h3>
              <p className="text-gray-600 text-center mb-6">
                Get personalized healthcare scheme recommendations based on your profile
              </p>
              <div className="flex items-center justify-center text-blue-600">
                <Bot className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">AI Powered</span>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-orange-600">4</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">Fetch Schemes</h3>
              <p className="text-gray-600 text-center mb-6">
                Browse and select from government-approved healthcare schemes
              </p>
              <div className="flex items-center justify-center text-orange-600">
                <FileText className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Verified Schemes</span>
              </div>
            </div>

            {/* Step 5 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-red-600">5</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">Claim & Convert</h3>
              <p className="text-gray-600 text-center mb-6">
                Convert approved schemes to digital vouchers in your wallet
              </p>
              <div className="flex items-center justify-center text-red-600">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Instant Conversion</span>
              </div>
            </div>

            {/* Step 6 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-indigo-600">6</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">Pay Hospitals</h3>
              <p className="text-gray-600 text-center mb-6">
                Use vouchers to make instant payments to healthcare providers
              </p>
              <div className="flex items-center justify-center text-indigo-600">
                <Zap className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Lightning Fast</span>
              </div>
            </div>

            {/* Step 7 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-teal-600">7</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">Download Receipt</h3>
              <p className="text-gray-600 text-center mb-6">
                Get detailed transaction receipts for your records
              </p>
              <div className="flex items-center justify-center text-teal-600">
                <Download className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Digital Receipts</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose HealthChainAI?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of healthcare with our cutting-edge technology and user-centric approach
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Bank-Grade Security</h3>
              <p className="text-gray-600">
                Your health data and transactions are protected with enterprise-level encryption and security protocols
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Global Standards</h3>
              <p className="text-gray-600">
                Built on international healthcare standards and best practices for maximum compatibility
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Smartphone className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Mobile First</h3>
              <p className="text-gray-600">
                Optimized for mobile devices, ensuring seamless access from anywhere, anytime
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-10 h-10 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Government Approved</h3>
              <p className="text-gray-600">
                All schemes and processes are verified and approved by government healthcare authorities
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-10 h-10 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Instant Processing</h3>
              <p className="text-gray-600">
                Real-time processing ensures your healthcare needs are met without delays
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-teal-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Patient Centric</h3>
              <p className="text-gray-600">
                Designed with patients in mind, prioritizing ease of use and accessibility
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Powered by Advanced Technology
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built with cutting-edge technologies for secure, scalable, and efficient healthcare management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-shadow border border-gray-100">
              <div className="bg-blue-500 text-white w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                ETH
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Ethereum</h3>
              <p className="text-gray-600 text-sm">
                Connect with MetaMask/WalletConnect for Sepolia ETH transactions
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-shadow border border-gray-100">
              <div className="bg-green-500 text-white w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                X402
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">X402 Protocol</h3>
              <p className="text-gray-600 text-sm">
                Gasless transactions and advanced blockchain security
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-shadow border border-gray-100">
              <div className="bg-blue-500 text-white w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                AI
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Intelligence</h3>
              <p className="text-gray-600 text-sm">
                Smart recommendations and automated scheme matching
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-shadow border border-gray-100">
              <div className="bg-orange-500 text-white w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                Web3
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Web3 Ready</h3>
              <p className="text-gray-600 text-sm">
                Decentralized architecture for enhanced security and transparency
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Healthcare Experience?
          </h2>
            <p className="text-xl text-blue-100 mb-8">
            Join thousands of users who have already simplified their healthcare journey with HealthChainAI
          </p>
          <Link href="/create-healthid">
            <button className="bg-white text-blue-600 px-10 py-4 rounded-full font-semibold text-lg hover:bg-blue-50 transition-all duration-300 flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Get Started Now
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Heart className="w-8 h-8 text-red-400 mr-2" />
                <span className="text-2xl font-bold">HealthChainAI</span>
              </div>
              <p className="text-gray-400 mb-4">
                Revolutionizing healthcare access through technology and innovation
              </p>
              <div className="flex space-x-4">
                <Star className="w-5 h-5 text-yellow-400" />
                <Star className="w-5 h-5 text-yellow-400" />
                <Star className="w-5 h-5 text-yellow-400" />
                <Star className="w-5 h-5 text-yellow-400" />
                <Star className="w-5 h-5 text-yellow-400" />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/create-healthid" className="text-gray-400 hover:text-white transition-colors">Enter ABHA ID</Link></li>
                <li><Link href="/wallet-setup" className="text-gray-400 hover:text-white transition-colors">Wallet Setup</Link></li>
                <li><Link href="/ai-recommendation" className="text-gray-400 hover:text-white transition-colors">AI Recommendation</Link></li>
                <li><Link href="/schemes" className="text-gray-400 hover:text-white transition-colors">Schemes</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-400">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>1800-HEALTHCHAIN</span>
                </li>
                <li className="flex items-center text-gray-400">
                  <Mail className="w-4 h-4 mr-2" />
                  <span>support@healthchainpro.com</span>
                </li>
                <li className="flex items-center text-gray-400">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>24/7 Available</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Data Protection</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Compliance</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 HealthChainAI. All rights reserved. Built with ❤️ for better healthcare.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
