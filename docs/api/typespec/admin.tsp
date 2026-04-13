import "@typespec/http";

using TypeSpec.Http;

namespace CallsCalendar {
  /** Операции владельца календаря: типы событий и сводка по бронированиям. */
  @route("/api")
  @tag("admin")
  interface Admin {
    @doc("Создать тип события (владелец).")
    @post
    @route("/event-types")
    createEventType(@body body: CreateEventTypeRequest): {
      @statusCode _: 201;
      @body resource: EventType;
    };

    @doc("Обновить тип события (владелец).")
    @put
    @route("/event-types")
    updateEventType(@body body: EventType): EventType;

    @doc("Все бронирования в одном списке (предстоящие встречи).")
    @get
    @route("/bookings")
    getBookings(): Booking[];
  }
}
