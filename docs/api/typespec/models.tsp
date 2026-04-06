namespace CallsCalendar {
  /** Тип события: идентификатор, название, описание, длительность. */
  @doc("Тип события для бронирования.")
  model EventType {
    /** Строковый id, например DEFAULT или QUICK. */
    id: string;

    name: string;
    description: string;
    durationMinutes: int32;
  }

  /** Бронирование слота. */
  @doc("Бронирование: тип события, время начала, данные гостя.")
  model Booking {
    @format("uuid")
    id: string;

    eventTypeId: string;
    startTime: utcDateTime;
    guestName: string;
    guestContact: string;
  }

  /** Единственный заданный профиль владельца календаря. */
  @doc("Владелец календаря (один профиль в системе).")
  model CalendarOwner {
    @format("uuid")
    id: string;

    name: string;
    contact: string;
  }

  /** Создание типа события владельцем (id задаётся клиентом). */
  model CreateEventTypeRequest {
    id: string;
    name: string;
    description: string;
    durationMinutes: int32;
  }

  /** Создание брони гостем. */
  model CreateBookingRequest {
    eventTypeId: string;
    startTime: utcDateTime;
    guestName: string;
    guestContact: string;
  }

  /** Свободный интервал в календаре. */
  model AvailableSlot {
    startTime: utcDateTime;
    endTime: utcDateTime;
  }

  /** Ошибка: на это время уже есть запись (в т.ч. другого типа события). */
  model ConflictError {
    message: string;
  }
}
