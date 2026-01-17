import { HealthId, Voucher, Transaction } from "@shared/schema";

// Local storage utilities for demo purposes
export class LocalStorage {
  static setHealthId(healthId: HealthId): void {
    localStorage.setItem('healthId', JSON.stringify(healthId));
  }

  static getHealthId(): HealthId | null {
    const stored = localStorage.getItem('healthId');
    return stored ? JSON.parse(stored) : null;
  }

  static setVouchers(vouchers: Voucher[]): void {
    localStorage.setItem('vouchers', JSON.stringify(vouchers));
  }

  static getVouchers(): Voucher[] {
    const stored = localStorage.getItem('vouchers');
    return stored ? JSON.parse(stored) : [];
  }

  static addVoucher(voucher: Voucher): void {
    const vouchers = this.getVouchers();
    vouchers.push(voucher);
    this.setVouchers(vouchers);
  }

  static updateVoucher(voucherId: string, updates: Partial<Voucher>): void {
    const vouchers = this.getVouchers();
    const index = vouchers.findIndex(v => v.id === voucherId);
    if (index !== -1) {
      vouchers[index] = { ...vouchers[index], ...updates };
      this.setVouchers(vouchers);
    }
  }

  static setTransactions(transactions: Transaction[]): void {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }

  static getTransactions(): Transaction[] {
    const stored = localStorage.getItem('transactions');
    return stored ? JSON.parse(stored) : [];
  }

  static addTransaction(transaction: Transaction): void {
    const transactions = this.getTransactions();
    transactions.push(transaction);
    this.setTransactions(transactions);
  }

  static getWalletBalance(): number {
    const stored = localStorage.getItem('walletBalance');
    return stored ? parseFloat(stored) : 0; // Start with 0 instead of 1250
  }

  static setWalletBalance(balance: number): void {
    localStorage.setItem('walletBalance', balance.toString());
  }

  static updateWalletBalance(amount: number): void {
    const currentBalance = this.getWalletBalance();
    this.setWalletBalance(currentBalance - amount);
  }

  static getLastTransaction(): Transaction | null {
    const stored = localStorage.getItem('lastTransaction');
    return stored ? JSON.parse(stored) : null;
  }

  static setLastTransaction(transaction: Transaction): void {
    localStorage.setItem('lastTransaction', JSON.stringify(transaction));
  }
}

// Mock data for schemes
export const mockSchemes = [
  {
    id: 'diabetes-care',
    name: 'Diabetes Care Plus',
    description: 'Comprehensive diabetes management program designed for Type 2 diabetes patients. Includes specialized care, regular monitoring, medication coverage, and dietary consultation.',
    coverage: 5000,
    processingTime: '2-3 days',
    networkHospitals: 500,
    matchPercentage: 95,
    type: 'diabetes-care' as const,
  },
  {
    id: 'general-health',
    name: 'General Health Shield',
    description: 'Basic health insurance covering routine checkups, emergency care, preventive treatments, and essential medical procedures with nationwide coverage.',
    coverage: 3000,
    processingTime: '1-2 days',
    networkHospitals: 800,
    matchPercentage: 87,
    type: 'general-health' as const,
  },
  {
    id: 'family-care',
    name: 'Family Care Package',
    description: 'Extended family health coverage including spouse and dependents under one comprehensive plan with shared benefits and family-oriented services.',
    coverage: 8000,
    processingTime: '3-5 days',
    networkHospitals: 600,
    matchPercentage: 78,
    type: 'family-care' as const,
  },
];

// Mock hospitals
export const mockHospitals = [
  { name: 'Apollo Hospital', location: 'Sector 26, Delhi - 24/7 Available' },
  { name: 'Max Healthcare', location: 'Saket, Delhi - Specialized Care' },
  { name: 'Fortis Hospital', location: 'Gurgaon - Emergency Care' },
];
