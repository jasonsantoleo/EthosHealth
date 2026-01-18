import { type HealthId, type CreateHealthIdForm } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getHealthId(id: string): Promise<HealthId | undefined>;
  createHealthId(healthId: CreateHealthIdForm): Promise<HealthId>;
  getAllHealthIds(): Promise<HealthId[]>;
}

export class MemStorage implements IStorage {
  private healthIds: Map<string, HealthId>;

  constructor() {
    this.healthIds = new Map();
  }

  async getHealthId(id: string): Promise<HealthId | undefined> {
    return this.healthIds.get(id);
  }

  async createHealthId(healthId: CreateHealthIdForm): Promise<HealthId> {
    const id = randomUUID();
    const newHealthId: HealthId = { 
      ...healthId, 
      id, 
      createdAt: new Date() 
    };
    this.healthIds.set(id, newHealthId);
    return newHealthId;
  }

  async getAllHealthIds(): Promise<HealthId[]> {
    return Array.from(this.healthIds.values());
  }
}

export const storage = new MemStorage();
