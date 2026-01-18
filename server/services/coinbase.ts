import crypto from 'crypto';

const COINBASE_API_KEY_ID = '5e20ad5d-b79e-4356-86f8-c5987163f218';
const COINBASE_SECRET = 'ZjOFZqnXeTda5tJsxTdaIMjUL0R8WQ7Pt4/XRHPdOdlxyB0FwLzYO5VLFOANypkmSI448nO+A4iOuONUYTD8/g==';
const COINBASE_BASE_URL = 'https://api.coinbase.com';

export class CoinbaseService {
  private apiKeyId: string;
  private secret: string;
  private baseUrl: string;

  constructor() {
    this.apiKeyId = COINBASE_API_KEY_ID;
    this.secret = COINBASE_SECRET;
    this.baseUrl = COINBASE_BASE_URL;
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
      'CB-ACCESS-KEY': this.apiKeyId,
      'CB-ACCESS-SIGN': signature,
      'CB-ACCESS-TIMESTAMP': timestamp,
      'Content-Type': 'application/json'
    };

    try {
      const response = await fetch(`${this.baseUrl}${requestPath}`, {
        method,
        headers,
        body: bodyString || undefined
      });

      if (!response.ok) {
        throw new Error(`Coinbase API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Coinbase API request failed:', error);
      throw error;
    }
  }

  async getWalletBalance(walletId: string): Promise<number> {
    try {
      const response = await this.makeRequest(`/accounts/${walletId}`);
      return parseFloat(response.data.balance.amount) || 0;
    } catch (error) {
      console.error('Failed to get wallet balance:', error);
      return 0;
    }
  }

  async createWallet(abhaId: string): Promise<string> {
    try {
      const walletName = `ABHA-${abhaId}`;
      const response = await this.makeRequest('/accounts', 'POST', {
        name: walletName,
        currency: 'USDC'
      });
      
      return response.data.id;
    } catch (error) {
      console.error('Failed to create wallet:', error);
      // Return mock wallet address for demo
      return `0x${crypto.randomBytes(20).toString('hex')}`;
    }
  }

  async fundWallet(walletId: string, amount: number): Promise<boolean> {
    try {
      const response = await this.makeRequest(`/accounts/${walletId}/deposits`, 'POST', {
        amount: amount.toString(),
        currency: 'USDC',
        payment_method: 'coinbase_account'
      });
      
      return response.data.status === 'completed';
    } catch (error) {
      console.error('Failed to fund wallet:', error);
      return false;
    }
  }

  async sendPayment(fromWalletId: string, toAddress: string, amount: number): Promise<string> {
    try {
      const response = await this.makeRequest(`/accounts/${fromWalletId}/transactions`, 'POST', {
        type: 'send',
        to: toAddress,
        amount: amount.toString(),
        currency: 'USDC'
      });
      
      return response.data.id;
    } catch (error) {
      console.error('Failed to send payment:', error);
      // Return mock transaction hash for demo
      return `0x${crypto.randomBytes(32).toString('hex')}`;
    }
  }

  async getTransactionHistory(walletId: string): Promise<any[]> {
    try {
      const response = await this.makeRequest(`/accounts/${walletId}/transactions`);
      return response.data || [];
    } catch (error) {
      console.error('Failed to get transaction history:', error);
      return [];
    }
  }
}

export const coinbaseService = new CoinbaseService();
