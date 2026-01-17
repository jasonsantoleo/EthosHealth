import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Hospital, Wallet, CheckCircle, ArrowRight, DollarSign, Calendar, Building, MapPin, Navigation, Star, X, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { LocalStorage } from "@/lib/storage";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Voucher {
  id: string;
  schemeId: string;
  schemeName: string;
  amount: number;
  status: string;
  createdAt: string;
  provider: string;
  estimatedBenefit: string;
}

interface Hospital {
  id: string;
  name: string;
  location: string;
  city: string;
  state?: string;
  specializations: string[];
  rating: number;
  distance: string;
  availableServices: string[];
  coordinates?: {
    lat: number;
    lng: number;
  };
  distanceKm?: number;
}

export default function PayHospital() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [filteredHospitals, setFilteredHospitals] = useState<Hospital[]>([]);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [selectedVouchers, setSelectedVouchers] = useState<Set<string>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number; address?: string } | null>(null);
  const [preferredLocations, setPreferredLocations] = useState<string[]>([]);
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  const [locationInput, setLocationInput] = useState("");
  const [filterType, setFilterType] = useState<'all' | 'nearby' | 'preferred'>('all');
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Fetch hospitals from MongoDB API
  const fetchHospitalsFromAPI = async (): Promise<Hospital[] | null> => {
    try {
      // Note: In a real app, you'd need to include authentication token
      // For now, we'll try to fetch but fall back to mock data if it fails
      const response = await fetch('/api/hospitals', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.hospitals && data.hospitals.length > 0) {
          // Transform API data to match our Hospital interface
          return data.hospitals.map((h: any) => ({
            id: h.id,
            name: h.name,
            location: h.location,
            city: h.city,
            state: h.state,
            specializations: h.specializations || [],
            rating: h.rating || 0,
            distance: '0 km', // Will be calculated based on current location
            availableServices: h.availableServices || [],
            coordinates: h.coordinates,
          }));
        }
      }
      return null;
    } catch (error) {
      console.log('API fetch failed, using mock data:', error);
      return null;
    }
  };

  useEffect(() => {
    // Load vouchers and hospitals
    const loadData = async () => {
      try {
        // Load created vouchers from localStorage
        const createdVouchers = localStorage.getItem('created_vouchers');
        if (createdVouchers) {
          setVouchers(JSON.parse(createdVouchers));
        } else {
          // Fallback to mock vouchers
          const mockVouchers: Voucher[] = [
            {
              id: 'voucher-diabetes-care',
              schemeId: 'diabetes-care',
              schemeName: 'Diabetes Care Plus',
              amount: 50,
              status: 'active',
              createdAt: new Date().toISOString(),
              provider: 'Government Health Scheme',
              estimatedBenefit: '$5,000'
            },
            {
              id: 'voucher-general-health',
              schemeId: 'general-health',
              schemeName: 'General Health Shield',
              amount: 30,
              status: 'active',
              createdAt: new Date().toISOString(),
              provider: 'Government Health Scheme',
              estimatedBenefit: '$3,000'
            }
          ];
          setVouchers(mockVouchers);
        }

        // Try to fetch hospitals from MongoDB API first
        const apiHospitals = await fetchHospitalsFromAPI();
        if (apiHospitals && apiHospitals.length > 0) {
          console.log('✅ Loaded hospitals from MongoDB:', apiHospitals.length);
          setHospitals(apiHospitals);
        } else {
          // Fallback to mock hospitals with coordinates (Chennai and Trichy)
          console.log('📝 Using mock hospital data (MongoDB not available or empty)');
          const mockHospitals: Hospital[] = [
          // Chennai Hospitals
          {
            id: 'apollo-chennai-001',
            name: 'Apollo Hospitals',
            location: 'Greams Road, Chennai',
            city: 'Chennai',
            state: 'Tamil Nadu',
            specializations: ['Cardiology', 'Diabetes Care', 'General Surgery', 'Oncology'],
            rating: 4.8,
            distance: '3.2 km',
            availableServices: ['Emergency Care', 'OPD', 'Inpatient', 'Diagnostics', 'ICU'],
            coordinates: { lat: 13.0604, lng: 80.2496 }
          },
          {
            id: 'fortis-chennai-002',
            name: 'Fortis Malar Hospital',
            location: 'Adyar, Chennai',
            city: 'Chennai',
            state: 'Tamil Nadu',
            specializations: ['Cardiology', 'Neurology', 'Orthopedics', 'Emergency Medicine'],
            rating: 4.6,
            distance: '8.5 km',
            availableServices: ['Emergency Care', 'OPD', 'Inpatient', 'Trauma Center', 'ICU'],
            coordinates: { lat: 12.9716, lng: 80.2206 }
          },
          {
            id: 'miot-chennai-003',
            name: 'MIOT International',
            location: 'Manapakkam, Chennai',
            city: 'Chennai',
            state: 'Tamil Nadu',
            specializations: ['Orthopedics', 'Cardiology', 'General Surgery', 'Urology'],
            rating: 4.7,
            distance: '12.3 km',
            availableServices: ['Emergency Care', 'OPD', 'Inpatient', 'Diagnostics', 'Surgery'],
            coordinates: { lat: 13.0067, lng: 80.1833 }
          },
          {
            id: 'gleneagles-chennai-004',
            name: 'Gleneagles Global Hospitals',
            location: 'Perumbakkam, Chennai',
            city: 'Chennai',
            state: 'Tamil Nadu',
            specializations: ['Oncology', 'Cardiology', 'Neurology', 'Transplant'],
            rating: 4.5,
            distance: '15.8 km',
            availableServices: ['Emergency Care', 'OPD', 'Inpatient', 'Research', 'Specialized Care'],
            coordinates: { lat: 12.9010, lng: 80.2209 }
          },
          {
            id: 'sri-ramachandra-chennai-005',
            name: 'Sri Ramachandra Medical Centre',
            location: 'Porur, Chennai',
            city: 'Chennai',
            state: 'Tamil Nadu',
            specializations: ['Cardiology', 'General Medicine', 'Pediatrics', 'Gynecology'],
            rating: 4.4,
            distance: '18.2 km',
            availableServices: ['Emergency Care', 'OPD', 'Inpatient', 'Diagnostics'],
            coordinates: { lat: 13.0358, lng: 80.1561 }
          },
          // Trichy Hospitals
          {
            id: 'apollo-trichy-006',
            name: 'Apollo Speciality Hospitals',
            location: 'Race Course Road, Trichy',
            city: 'Trichy',
            state: 'Tamil Nadu',
            specializations: ['Cardiology', 'Diabetes Care', 'General Surgery', 'Nephrology'],
            rating: 4.7,
            distance: '0 km',
            availableServices: ['Emergency Care', 'OPD', 'Inpatient', 'Diagnostics', 'Dialysis'],
            coordinates: { lat: 10.7905, lng: 78.7047 }
          },
          {
            id: 'kaveri-trichy-007',
            name: 'Kaveri Medical Centre',
            location: 'Thillai Nagar, Trichy',
            city: 'Trichy',
            state: 'Tamil Nadu',
            specializations: ['Cardiology', 'Orthopedics', 'General Medicine', 'Pediatrics'],
            rating: 4.5,
            distance: '0 km',
            availableServices: ['Emergency Care', 'OPD', 'Inpatient', 'Diagnostics'],
            coordinates: { lat: 10.8045, lng: 78.6884 }
          },
          {
            id: 'sri-ram-trichy-008',
            name: 'Sri Ramakrishna Hospital',
            location: 'Srirangam, Trichy',
            city: 'Trichy',
            state: 'Tamil Nadu',
            specializations: ['General Medicine', 'Surgery', 'Gynecology', 'Pediatrics'],
            rating: 4.3,
            distance: '0 km',
            availableServices: ['Emergency Care', 'OPD', 'Inpatient', 'Maternity Care'],
            coordinates: { lat: 10.8631, lng: 78.6869 }
          },
          {
            id: 'vijaya-trichy-009',
            name: 'Vijaya Hospital',
            location: 'Cantonment, Trichy',
            city: 'Trichy',
            state: 'Tamil Nadu',
            specializations: ['Cardiology', 'Neurology', 'Orthopedics', 'Emergency Medicine'],
            rating: 4.4,
            distance: '0 km',
            availableServices: ['Emergency Care', 'OPD', 'Inpatient', 'Trauma Center'],
            coordinates: { lat: 10.8050, lng: 78.6910 }
          },
          {
            id: 'mahatma-trichy-010',
            name: 'Mahatma Gandhi Memorial Government Hospital',
            location: 'Fort Station Road, Trichy',
            city: 'Trichy',
            state: 'Tamil Nadu',
            specializations: ['General Medicine', 'Surgery', 'Pediatrics', 'Gynecology'],
            rating: 4.2,
            distance: '0 km',
            availableServices: ['Emergency Care', 'OPD', 'Inpatient', 'Public Health Services'],
            coordinates: { lat: 10.7905, lng: 78.7047 }
          }
          ];
          setHospitals(mockHospitals);
        }

        // Load current location from localStorage
        const savedLocation = localStorage.getItem('currentLocation');
        if (savedLocation) {
          setCurrentLocation(JSON.parse(savedLocation));
        } else {
          // Default location (Chennai center)
          const defaultLocation = { lat: 13.0827, lng: 80.2707, address: 'Chennai, Tamil Nadu, India' };
          setCurrentLocation(defaultLocation);
          localStorage.setItem('currentLocation', JSON.stringify(defaultLocation));
        }

        // Load preferred locations from localStorage
        const savedPreferred = localStorage.getItem('preferredLocations');
        if (savedPreferred) {
          setPreferredLocations(JSON.parse(savedPreferred));
        } else {
          // Default preferred location (Trichy)
          const defaultPreferred = ['Trichy'];
          setPreferredLocations(defaultPreferred);
          localStorage.setItem('preferredLocations', JSON.stringify(defaultPreferred));
        }

        // Load wallet balance
        const balance = localStorage.getItem('walletBalance');
        setWalletBalance(balance ? parseFloat(balance) : 0);
      } catch (error) {
        console.error('Error loading data:', error);
        // Fallback to mock data
        const mockVouchers: Voucher[] = [
          {
            id: 'voucher-pmjay',
            schemeId: 'pmjay-001',
            schemeName: 'Ayushman Bharat - PM-JAY',
            amount: 5000,
            status: 'active',
            createdAt: new Date().toISOString(),
            provider: 'Government of India',
            estimatedBenefit: '$6,250'
          }
        ];
        setVouchers(mockVouchers);
      }
    };

    loadData();
  }, []);

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Update hospital distances and filter based on current location and preferences
  useEffect(() => {
    if (currentLocation && hospitals.length > 0) {
      const hospitalsWithDistance = hospitals.map(hospital => {
        if (hospital.coordinates) {
          const distance = calculateDistance(
            currentLocation.lat,
            currentLocation.lng,
            hospital.coordinates.lat,
            hospital.coordinates.lng
          );
          return {
            ...hospital,
            distanceKm: distance,
            distance: `${distance.toFixed(1)} km`
          };
        }
        return hospital;
      });

      // Sort by distance
      hospitalsWithDistance.sort((a, b) => (a.distanceKm || Infinity) - (b.distanceKm || Infinity));

      // Filter based on filter type
      let filtered = hospitalsWithDistance;
      if (filterType === 'nearby') {
        // Show hospitals within 10 km
        filtered = hospitalsWithDistance.filter(h => (h.distanceKm || Infinity) <= 10);
      } else if (filterType === 'preferred') {
        // Show hospitals in preferred locations (match by city name)
        if (preferredLocations.length > 0) {
          filtered = hospitalsWithDistance.filter(h => {
            // Check if hospital's city matches any preferred location
            const hospitalCity = h.city?.toLowerCase() || '';
            return preferredLocations.some(pref => {
              const prefLower = pref.toLowerCase().trim();
              // Match by exact city name or if city contains preferred location
              return hospitalCity === prefLower || 
                     hospitalCity.includes(prefLower) || 
                     prefLower.includes(hospitalCity);
            });
          });
        } else {
          // If no preferred locations set, show empty
          filtered = [];
        }
      }

      setFilteredHospitals(filtered);
    } else {
      setFilteredHospitals(hospitals);
    }
  }, [hospitals, currentLocation, filterType, preferredLocations]);

  // Get current location using browser geolocation
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: 'Current Location'
          };
          setCurrentLocation(newLocation);
          localStorage.setItem('currentLocation', JSON.stringify(newLocation));
          toast({
            title: "Location Updated",
            description: "Your current location has been detected successfully.",
          });
        },
        (error) => {
          toast({
            title: "Location Error",
            description: "Unable to detect your location. Please set it manually.",
            variant: "destructive",
          });
        }
      );
    } else {
      toast({
        title: "Not Supported",
        description: "Geolocation is not supported by your browser.",
        variant: "destructive",
      });
    }
  };

  // Get unique cities from hospitals
  const getAvailableCities = (): string[] => {
    const cities = new Set<string>();
    hospitals.forEach(hospital => {
      if (hospital.city) {
        cities.add(hospital.city);
      }
    });
    return Array.from(cities).sort();
  };

  // Add preferred location
  const addPreferredLocation = () => {
    const location = locationInput.trim();
    if (location) {
      // Check if location already exists
      if (preferredLocations.some(pref => pref.toLowerCase() === location.toLowerCase())) {
        toast({
          title: "Location Already Added",
          description: `${location} is already in your preferred locations.`,
          variant: "destructive",
        });
        return;
      }
      
      const newPreferred = [...preferredLocations, location];
      setPreferredLocations(newPreferred);
      localStorage.setItem('preferredLocations', JSON.stringify(newPreferred));
      setLocationInput("");
      
      // Check if any hospitals match this location
      const matchingHospitals = hospitals.filter(h => {
        const hospitalCity = h.city?.toLowerCase() || '';
        return hospitalCity === location.toLowerCase() || 
               hospitalCity.includes(location.toLowerCase()) ||
               location.toLowerCase().includes(hospitalCity);
      });
      
      toast({
        title: "Preferred Location Added",
        description: `${location} has been added. ${matchingHospitals.length} hospital(s) found in this location.`,
      });
    }
  };

  // Remove preferred location
  const removePreferredLocation = (location: string) => {
    const updated = preferredLocations.filter(loc => loc !== location);
    setPreferredLocations(updated);
    localStorage.setItem('preferredLocations', JSON.stringify(updated));
    toast({
      title: "Preferred Location Removed",
      description: `${location} has been removed from your preferred locations.`,
    });
  };

  // Check if hospital is in preferred location
  const isPreferredLocation = (hospital: Hospital): boolean => {
    if (!hospital.city || preferredLocations.length === 0) return false;
    const hospitalCity = hospital.city.toLowerCase();
    return preferredLocations.some(pref => {
      const prefLower = pref.toLowerCase().trim();
      return hospitalCity === prefLower || 
             hospitalCity.includes(prefLower) || 
             prefLower.includes(hospitalCity);
    });
  };

  const handleVoucherSelection = (voucherId: string) => {
    setSelectedVouchers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(voucherId)) {
        newSet.delete(voucherId);
      } else {
        newSet.add(voucherId);
      }
      return newSet;
    });
  };

  const handleHospitalSelection = (hospital: Hospital) => {
    setSelectedHospital(hospital);
  };

  const handlePayHospital = async () => {
    if (!selectedHospital || selectedVouchers.size === 0) {
      toast({
        title: "Selection Required",
        description: "Please select a hospital and at least one voucher.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Calculate total amount
      const totalAmount = Array.from(selectedVouchers).reduce((sum, voucherId) => {
        const voucher = vouchers.find(v => v.id === voucherId);
        return sum + (voucher?.amount || 0);
      }, 0);
      
      // Update wallet balance
      const newBalance = walletBalance - totalAmount;
      localStorage.setItem('walletBalance', newBalance.toString());
      setWalletBalance(newBalance);
      
      // Mark vouchers as used
      const updatedVouchers = vouchers.map(voucher => 
        selectedVouchers.has(voucher.id) 
          ? { ...voucher, status: 'used' }
          : voucher
      );
      setVouchers(updatedVouchers);
      localStorage.setItem('created_vouchers', JSON.stringify(updatedVouchers));
      
      // Clear selections
      setSelectedVouchers(new Set());
      setSelectedHospital(null);
      
      // Record transaction for receipt page
      const transaction = {
        id: `tx-${Date.now()}`,
        voucherId: Array.from(selectedVouchers)[0] || 'voucher',
        hospitalName: selectedHospital.name,
        amount: totalAmount,
        status: 'completed',
        transactionId: `TXN${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        createdAt: new Date().toISOString(),
      };
      LocalStorage.addTransaction(transaction as any);
      LocalStorage.setLastTransaction(transaction as any);
      
      toast({
        title: "Payment Successful!",
        description: `Successfully paid ${selectedHospital.name} using ${selectedVouchers.size} vouchers ($${totalAmount} USDC)`,
      });
      
      // Navigate to receipt page
      setLocation("/receipt");
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: "Failed to process payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getTotalSelectedAmount = () => {
    return Array.from(selectedVouchers).reduce((sum, voucherId) => {
      const voucher = vouchers.find(v => v.id === voucherId);
      return sum + (voucher?.amount || 0);
    }, 0);
  };

  return (
    <div className="pt-16">
      <section className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 fade-in">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Hospital Payment</h1>
            <p className="text-xl text-gray-600">Use your USDC vouchers to pay for hospital services</p>
          </div>

          {/* Wallet Balance */}
          <Card className="glassmorphism rounded-2xl mb-8 slide-up">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Wallet className="h-8 w-8 text-medilinkx-blue mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Wallet Balance</h3>
                    <p className="text-sm text-gray-600">Available USDC for payments</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-medilinkx-blue">${walletBalance.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">USDC</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Available Vouchers */}
            <Card className="glassmorphism rounded-2xl slide-up">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-800">Available Vouchers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vouchers.filter(v => v.status === 'active').map((voucher) => {
                    const isSelected = selectedVouchers.has(voucher.id);
                    
                    return (
                      <div 
                        key={voucher.id}
                        className={`bg-white rounded-lg p-4 border-2 cursor-pointer transition-all ${
                          isSelected ? 'border-medilinkx-blue bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleVoucherSelection(voucher.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800">{voucher.schemeName}</h4>
                            <p className="text-sm text-gray-600">{voucher.provider}</p>
                            <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
                              <span className="flex items-center">
                                <DollarSign className="h-4 w-4 mr-1" />
                                {voucher.amount} USDC
                              </span>
                              <span className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {new Date(voucher.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            {isSelected && (
                              <CheckCircle className="h-6 w-6 text-medilinkx-blue" />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {vouchers.filter(v => v.status === 'active').length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Wallet className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No active vouchers available</p>
                    <p className="text-sm">Create vouchers in the Voucher Wallet first</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Hospital Selection */}
            <Card className="glassmorphism rounded-2xl slide-up">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl text-gray-800">Select Hospital</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowLocationDialog(true)}
                    className="flex items-center gap-2"
                  >
                    <Settings className="h-4 w-4" />
                    Location Settings
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Location Filter Tabs */}
                <div className="flex gap-2 mb-4">
                  <Button
                    variant={filterType === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterType('all')}
                    className="flex-1"
                  >
                    All Hospitals
                  </Button>
                  <Button
                    variant={filterType === 'nearby' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterType('nearby')}
                    className="flex-1"
                  >
                    <Navigation className="h-4 w-4 mr-1" />
                    Nearby
                  </Button>
                  <Button
                    variant={filterType === 'preferred' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterType('preferred')}
                    className="flex-1"
                    disabled={preferredLocations.length === 0}
                  >
                    <Star className="h-4 w-4 mr-1" />
                    Preferred
                  </Button>
                </div>

                {/* Current Location Display */}
                {currentLocation && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                        <div>
                          <p className="text-sm font-semibold text-gray-800">Current Location</p>
                          <p className="text-xs text-gray-600">
                            {currentLocation.address || `${currentLocation.lat.toFixed(4)}, ${currentLocation.lng.toFixed(4)}`}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={getCurrentLocation}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Navigation className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Preferred Locations Summary */}
                {filterType === 'preferred' && preferredLocations.length > 0 && (
                  <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center mb-2">
                      <Star className="h-4 w-4 mr-2 text-yellow-600" />
                      <p className="text-sm font-semibold text-gray-800">Showing hospitals from:</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {preferredLocations.map((location, index) => {
                        const matchingCount = hospitals.filter(h => {
                          const hospitalCity = h.city?.toLowerCase() || '';
                          const locLower = location.toLowerCase();
                          return hospitalCity === locLower || 
                                 hospitalCity.includes(locLower) || 
                                 locLower.includes(hospitalCity);
                        }).length;
                        return (
                          <span
                            key={index}
                            className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full border border-yellow-300"
                          >
                            {location} ({matchingCount})
                          </span>
                        );
                      })}
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                      Total: {filteredHospitals.length} hospital{filteredHospitals.length !== 1 ? 's' : ''} found
                    </p>
                  </div>
                )}

                <div className="space-y-4">
                  {filteredHospitals.length > 0 ? (
                    filteredHospitals.map((hospital) => {
                      const isSelected = selectedHospital?.id === hospital.id;
                      const isPreferred = isPreferredLocation(hospital);
                      
                      return (
                        <div 
                          key={hospital.id}
                          className={`bg-white rounded-lg p-4 border-2 cursor-pointer transition-all ${
                            isSelected ? 'border-medilinkx-green bg-green-50' : 
                            isPreferred ? 'border-yellow-400 bg-yellow-50' : 
                            'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => handleHospitalSelection(hospital)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-gray-800">{hospital.name}</h4>
                                {isPreferred && (
                                  <span className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full text-xs font-semibold">
                                    <Star className="h-3 w-3" />
                                    Preferred
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                {hospital.location} • {hospital.distance}
                              </p>
                              <div className="flex items-center mt-2">
                                <span className="text-yellow-600 font-semibold mr-2">★ {hospital.rating}</span>
                                <span className="text-sm text-gray-500">Rating</span>
                              </div>
                              <div className="mt-2">
                                <p className="text-sm text-gray-600">
                                  <strong>Specializations:</strong> {hospital.specializations.join(', ')}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              {isSelected && (
                                <CheckCircle className="h-6 w-6 text-medilinkx-green" />
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p className="font-semibold mb-2">No hospitals found</p>
                      {filterType === 'preferred' && preferredLocations.length > 0 ? (
                        <div className="space-y-2">
                          <p className="text-sm">
                            No hospitals found in your preferred locations: {preferredLocations.join(', ')}
                          </p>
                          <p className="text-xs">
                            Available cities: {getAvailableCities().join(', ')}
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowLocationDialog(true)}
                            className="mt-2"
                          >
                            Update Preferred Locations
                          </Button>
                        </div>
                      ) : filterType === 'nearby' ? (
                        <p className="text-sm">No hospitals found within 10 km. Try adjusting your current location.</p>
                      ) : (
                        <p className="text-sm">Try adjusting your filters or location settings</p>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Summary and Action */}
          {(selectedHospital || selectedVouchers.size > 0) && (
            <Card className="glassmorphism rounded-2xl mt-8 slide-up">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-800">Payment Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-medilinkx-blue">{selectedVouchers.size}</div>
                    <div className="text-sm text-gray-600">Vouchers Selected</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {selectedHospital ? selectedHospital.name : 'Not Selected'}
                    </div>
                    <div className="text-sm text-gray-600">Hospital</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">${getTotalSelectedAmount()}</div>
                    <div className="text-sm text-gray-600">Total Amount</div>
                  </div>
                </div>
                
                <div className="text-center space-y-4">
                  <Button 
                    onClick={handlePayHospital}
                    disabled={!selectedHospital || selectedVouchers.size === 0 || isProcessing}
                    className="bg-medilinkx-green hover:bg-green-700 px-8 py-3 font-semibold"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <Hospital className="mr-2 h-5 w-5" />
                        Pay Hospital (${getTotalSelectedAmount()} USDC)
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                  
                  <p className="text-sm text-gray-600">
                    Payment will be processed using your selected vouchers
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation */}
          <div className="text-center mt-8">
            <Link href="/receipt">
              <Button 
                variant="outline"
                className="px-8 py-3 font-semibold"
              >
                View Receipt
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Location Settings Dialog */}
      <Dialog open={showLocationDialog} onOpenChange={setShowLocationDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-gray-800">
              Location Settings
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Current Location Section */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Current Location</h3>
              {currentLocation && (
                <div className="bg-blue-50 rounded-lg p-3 mb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        {currentLocation.address || 'Current Location'}
                      </p>
                      <p className="text-xs text-gray-600">
                        {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={getCurrentLocation}
                      className="flex items-center gap-2"
                    >
                      <Navigation className="h-4 w-4" />
                      Detect
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Preferred Locations Section */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Preferred Locations</h3>
              
              {/* Show available cities */}
              <div className="mb-3">
                <p className="text-xs text-gray-600 mb-2">Available cities with hospitals:</p>
                <div className="flex flex-wrap gap-2">
                  {getAvailableCities().map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => {
                        if (!preferredLocations.some(pref => pref.toLowerCase() === city.toLowerCase())) {
                          setLocationInput(city);
                        }
                      }}
                      className={`text-xs px-2 py-1 rounded-full border transition-colors ${
                        preferredLocations.some(pref => pref.toLowerCase() === city.toLowerCase())
                          ? 'bg-yellow-100 border-yellow-400 text-yellow-800'
                          : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {city}
                      {preferredLocations.some(pref => pref.toLowerCase() === city.toLowerCase()) && (
                        <Star className="h-3 w-3 inline ml-1" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-2 mb-3">
                <Input
                  placeholder="Enter city name (e.g., Chennai, Trichy)"
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addPreferredLocation();
                    }
                  }}
                  className="flex-1"
                  list="available-cities"
                />
                <datalist id="available-cities">
                  {getAvailableCities().map((city) => (
                    <option key={city} value={city} />
                  ))}
                </datalist>
                <Button
                  onClick={addPreferredLocation}
                  className="bg-medilinkx-blue hover:bg-blue-700"
                  disabled={!locationInput.trim()}
                >
                  Add
                </Button>
              </div>
              
              {preferredLocations.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-gray-600 mb-2">
                    {filterType === 'preferred' 
                      ? `${filteredHospitals.length} hospital(s) found in preferred locations`
                      : 'Click "Preferred" filter to see hospitals in these locations'}
                  </p>
                  {preferredLocations.map((location, index) => {
                    const matchingCount = hospitals.filter(h => {
                      const hospitalCity = h.city?.toLowerCase() || '';
                      const locLower = location.toLowerCase();
                      return hospitalCity === locLower || 
                             hospitalCity.includes(locLower) || 
                             locLower.includes(hospitalCity);
                    }).length;
                    
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-yellow-50 rounded-lg p-3 border border-yellow-200"
                      >
                        <div className="flex items-center flex-1">
                          <Star className="h-4 w-4 mr-2 text-yellow-600" />
                          <div>
                            <span className="text-sm font-semibold text-gray-800">{location}</span>
                            <span className="text-xs text-gray-600 ml-2">
                              ({matchingCount} hospital{matchingCount !== 1 ? 's' : ''})
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removePreferredLocation(location)}
                          className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
              
              {preferredLocations.length === 0 && (
                <div className="text-center py-4 bg-gray-50 rounded-lg border border-gray-200">
                  <Star className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm text-gray-600 mb-1">No preferred locations added yet</p>
                  <p className="text-xs text-gray-500">
                    Add city names above to prioritize hospitals in those locations
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button
              variant="outline"
              onClick={() => setShowLocationDialog(false)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
