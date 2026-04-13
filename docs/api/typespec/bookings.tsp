import "@typespec/http";

using TypeSpec.Http;

namespace CallsCalendar {
  /** Публичный сценарий гостя: каталог типов, слоты, бронирование, профиль владельца. */
  @route("/api")
  @tag("bookings")
  interface Bookings {
    @doc("Список всех типов событий.")
    @get
    @route("/event-types")
    getEventTypes(): EventType[];

    @doc("Один тип события по id.")
    @get
    @route("/event-types/{id}")
    getEventType(@path id: string): EventType;

    @doc("Создать бронирование. 409 если слот пересекается с существующей записью.")
    @post
    @route("/bookings")
    createBooking(@body body: CreateBookingRequest): {
      @statusCode _: 201;
      @body booking: Booking;
    } | {
      @statusCode _: 409;
      @body error: ConflictError;
    };

    @doc("Доступные слоты для типа события на дату. Параметр date: ISO 8601, дата YYYY-MM-DD.")
    @get
    @route("/bookings/day-slots")
    getDaySlots(
      @query eventTypeId: string,
      @query date: string,
    ): DaySlot[];

    @doc("Профиль владельца календаря.")
    @get
    @route("/owner")
    getOwner(): CalendarOwner;
  }
}
