import { DateFields, DateInputFields } from "../domain/date";
import { DateRepository } from "../domain/date-repository";


export class ModifyDate {
  constructor(private readonly dateRepository: DateRepository) { }

  async run(dateId: number, dateInputFields: Partial<DateInputFields>): Promise<DateFields> {
    try {
      const modifiedDate = await this.dateRepository.modifyDate(dateId, dateInputFields);
      return modifiedDate;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Internal server error');
      }
    }
  }
}