import { Bus } from "./bus.model";

export interface BusResponse {
    route: any; // Replace `any` with the correct type if known
    matchedBuses: Bus[]; // Use your existing `Bus` interface or class
    busidwithseatobj: Record<string, any>; // Replace `any` with correct seat object type
  }
  