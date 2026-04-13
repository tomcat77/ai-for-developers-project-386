namespace CallsCalendar {
  /** Тип события: идентификатор, название, описание, длительность. */
  @doc("Тип события для бронирования.")
  model EventType {
    /** Строковый id, например DEFAULT или QUICK. */
    id: string;
    /* Название типа события */
    name: string;
    /* Описание типа события */
    description: string;
    durationMinutes: int32;
    /* Цвет типа события */
    color: string;
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
    name: string;
    description: string;
    durationMinutes: int32;
    color: string;
  }

  /** Создание брони гостем. */
  model CreateBookingRequest {
    eventTypeId: string;
    startTime: utcDateTime;
    guestName?: string;
    guestContact?: string;
  }

  /** Доступный интервал в календаре на конкретный день. */
  model DaySlot {
    startTime: utcDateTime;
    endTime: utcDateTime;
    isAvailable: boolean;
  }

  /** Ошибка: на это время уже есть запись (в т.ч. другого типа события). */
  model ConflictError {
    message: string;
  }
}
