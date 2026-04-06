import "@typespec/http";
import "@typespec/rest";
import "@typespec/openapi";
import "./models.tsp";
import "./admin.tsp";
import "./bookings.tsp";

using TypeSpec.Http;
using TypeSpec.OpenAPI;

/** API записи на звонки: владелец календаря и гости без регистрации. */
@service(#{ title: "Calls Calendar API" })
@info(#{ version: "0.1.0" })
@doc("API записи на звонки: владелец календаря и гости без регистрации.")
@tagMetadata("admin", #{ description: "Управление календарём: создание типов событий и просмотр всех бронирований." })
@tagMetadata("bookings", #{ description: "Сценарий гостя: каталог типов событий, свободные слоты, бронирование и профиль владельца." })
namespace CallsCalendar {}