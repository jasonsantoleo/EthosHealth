import crypto from 'crypto';

const X402_API_KEY = '5e20ad5d-b79e-4356-86f8-c5987163f218';
const X402_SECRET = 'ZjOFZqnXeTda5tJsxTdaIMjUL0R8WQ7Pt4/XRHPdOdlxyB0FwLzYO5VLFOANypkmSI448nO+A4iOuONUYTD8/g==';
const X402_BASE_URL = 'https://api.coinbase.com';

export class X402Service {
  private apiKey: string;
  private secret: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = X402_API_KEY;
    this.secret = X402_SECRET;
    this.baseUrl = X402_BASE_URL;
  }

  private generateSignature(timestamp: string, method: string, requestPath: string, body: string = ''): string {
    const message = timestamp + method + requestPath + body;
    const signature = crypto.createHmac('sha256', this.secret).update(message).digest('hex');
    return signature;
  }

  private async makeRequest(endpoint: string, method: string = 'GET', body?: any) {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const requestPath = `/v2${endpoint}`;
    const bodyString = body ? JSON.stringify(body) : '';
    
    const signature = this.generateSignature(timestamp, method, requestPath, bodyString);
    
    const headers = {
      'X402-ACCESS-KEY': this.apiKey,
      'X402-ACCESS-SIGN': signature,
      'X402-ACCESS-TIMESTAMP': timestamp,
      'Content-Type': 'application/json'
    };

    try {
      const response = await fetch(`${this.baseUrl}${requestPath}`, {
        method,
        headers,
        body: bodyString || undefined
      });

      if (!response.ok) {
        throw new Error(`X402 API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('X402 API request failed:', error);
      throw error;
    }
  }

  async getTreasuryBalance(): Promise<number> {
    try {
      const response = await this.makeRequest('/accounts/treasury');
      return parseFloat(response.data.balance.amount) || 1000000; // Default 1M USDC
    } catch (error) {
      console.error('Failed to get treasury balance:', error);
      return 1000000; // Mock balance
    }
  }

  async createVoucher(beneficiaryId: string, amount: number, description: string): Promise<string> {
    try {
      const voucherId = `voucher-${crypto.randomBytes(16).toString('hex')}`;
      
      // Mock voucher creation for demo
      const voucher = {
        id: voucherId,
        beneficiary_id: beneficiaryId,
        amount: amount,
        description: description,
        status: 'active',
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
      };

      return voucherId;
    } catch (error) {
      console.error('Failed to create voucher:', error);
      throw error;
    }
  }

  async validateVoucher(voucherId: string): Promise<boolean> {
    try {
      // Mock validation for demo
      return voucherId.startsWith('voucher-');
    } catch (error) {
      console.error('Failed to validate voucher:', error);
      return false;
    }
  }

  async redeemVoucher(voucherId: string, hospitalAddress: string, amount: number): Promise<string> {
    try {
      const transactionId = `tx-${crypto.randomBytes(16).toString('hex')}`;
      
      // Mock redemption for demo
      const transaction = {
        id: transactionId,
        voucher_id: voucherId,
        hospital_address: hospitalAddress,
        amount: amount,
        status: 'completed',
        timestamp: new Date().toISOString(),
        gas_fee: 0, // Gasless transaction
        transaction_hash: `0x${crypto.randomBytes(32).toString('hex')}`
      };

      return transactionId;
    } catch (error) {
      console.error('Failed to redeem voucher:', error);
      throw error;
    }
  }

  async convertToFiat(amount: number, fromCurrency: string = 'USDC', toCurrency: string = 'INR'): Promise<number> {
    try {
      // Mock conversion rate for demo (1 USDC = 83 INR)
      const conversionRate = 83;
      return amount * conversionRate;
    } catch (error) {
      console.error('Failed to convert to fiat:', error);
      return amount * 83; // Default rate
    }
  }

  async getVoucherDetails(voucherId: string): Promise<any> {
    try {
      // Mock voucher details for demo
      return {
        id: voucherId,
        status: 'active',
        amount: 100,
        beneficiary_id: '12345678901234',
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      };
    } catch (error) {
      console.error('Failed to get voucher details:', error);
      throw error;
    }
  }

  async getBeneficiaryVouchers(beneficiaryId: string): Promise<any[]> {
    try {
      // Mock beneficiary vouchers for demo
      return [
        {
          id: `voucher-${crypto.randomBytes(8).toString('hex')}`,
          amount: 100,
          status: 'active',
          created_at: new Date().toISOString()
        },
        {
          id: `voucher-${crypto.randomBytes(8).toString('hex')}`,
          amount: 200,
          status: 'active',
          created_at: new Date().toISOString()
        }
      ];
    } catch (error) {
      console.error('Failed to get beneficiary vouchers:', error);
      return [];
    }
  }

  async getTransactionHistory(): Promise<any[]> {
    try {
      // Mock transaction history for demo
      return [
        {
          id: `tx-${crypto.randomBytes(8).toString('hex')}`,
          type: 'voucher_creation',
          amount: 100,
          status: 'completed',
          timestamp: new Date().toISOString()
        },
        {
          id: `tx-${crypto.randomBytes(8).toString('hex')}`,
          type: 'voucher_redemption',
          amount: 200,
          status: 'completed',
          timestamp: new Date().toISOString()
        }
      ];
    } catch (error) {
      console.error('Failed to get transaction history:', error);
      return [];
    }
  }

  async getGaslessStats(): Promise<any> {
    try {
      // Mock gasless stats for demo
      return {
        total_transactions: 1500,
        total_gas_saved: 0.5, // ETH
        total_value_transferred: 50000, // USDC
        average_transaction_time: 2.5 // seconds
      };
    } catch (error) {
      console.error('Failed to get gasless stats:', error);
      return {
        total_transactions: 1500,
        total_gas_saved: 0.5,
        total_value_transferred: 50000,
        average_transaction_time: 2.5
      };
    }
  }

  async createWallet(abhaId: string): Promise<string> {
    try {
      const walletAddress = `0x${crypto.randomBytes(20).toString('hex')}`;
      
      // Mock wallet creation for demo
      return walletAddress;
    } catch (error) {
      console.error('Failed to create wallet:', error);
      throw error;
    }
  }
}

export const x402Service = new X402Service();
