export interface EventType {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  color: string;
}

export interface CreateEventTypeRequest {
  name: string;
  description: string;
  durationMinutes: number;
  color: string;
}

export interface UpdateEventTypeRequest {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  color: string;
}