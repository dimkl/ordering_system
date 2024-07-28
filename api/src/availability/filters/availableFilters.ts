interface IAvailableFilters {
  capacity: number | undefined;
  section_id: string | undefined;
  slot_id: string | undefined;
  started_at: string | undefined;
  ended_at: string | undefined;
  // Duration in minutes
  duration: number | undefined;
}

export class AvailableFilters implements IAvailableFilters {
  capacity: number | undefined;
  section_id: string | undefined;
  slot_id: string | undefined;
  started_at: string | undefined;
  ended_at: string | undefined;
  duration: number | undefined;

  constructor(data: Record<string, string>, defaults: Partial<IAvailableFilters> = {}) {
    this.capacity = data.capacity ? Number.parseInt(data.capacity as string) : defaults.capacity;
    this.duration = data.duration ? Number.parseInt(data.duration as string) : defaults.duration;
    this.section_id = data.section_id || defaults.section_id;
    this.slot_id = data.slot_id || defaults.slot_id;
    this.started_at = data.started_at || defaults.started_at;
    this.ended_at = data.ended_at || defaults.ended_at;
  }
}
