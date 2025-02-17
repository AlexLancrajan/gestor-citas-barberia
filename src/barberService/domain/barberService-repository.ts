import { barberService } from "./barberService";

export interface barberServiceRepository {
  getbarberService(barberId: string | undefined, serviceId: number | undefined): Promise<barberService | null>

  getAllbarberService(page: number, pageSize: number): Promise<barberService[] | null>

  createBarberService(barberServiceInput: barberService): Promise<barberService>

  modifyBarberService(
    barberId: string, 
    serviceId: number, 
    barberServiceInput: Partial<barberService>): Promise<barberService>
  
  deleteBarberService(barberId: string, serviceId: number): Promise<number>
}