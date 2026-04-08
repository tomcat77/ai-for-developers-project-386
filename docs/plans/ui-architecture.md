# Архитектура UI приложения Calls Calendar

Документ содержит полную структуру и архитектуру frontend-приложения на Angular 21.

## 1. Общая информация о проекте

### Стек технологий
- **Framework**: Angular 21
- **UI Library**: Angular Material 21
- **Calendar**: angular-calendar (для отображения календарей)
- **Dates**: date-fns + date-fns-tz (для работы с датами и часовыми поясами)
- **Color Picker**: ngx-color-picker (для выбора цвета типов событий)
- **State**: Angular Signals (встроенный state management)

### Структура проекта
```
frontend/src/app/
├── core/                    # Core-модули (singleton)
│   ├── models/              # TypeScript interfaces из API
│   ├── services/            # API сервисы
│   ├── state/               # Signal-based state management
│   └── interceptors/        # HTTP interceptors
├── features/                # Lazy-loaded feature модули
│   ├── home/                # Главная страница
│   ├── booking/             # Модуль бронирования
│   └── admin/               # Админка с календарной сеткой
├── shared/                  # Переиспользуемые компоненты
│   ├── components/          # UI компоненты
│   ├── validators/          # Кастомные валидаторы
│   └── material/            # Material imports
└── app.component.ts
```

---

## 2. Маршрутизация (Routing)

| Путь | Компонент | Описание |
|------|-----------|----------|
| `/` | `HomeComponent` | Landing page (скриншот 01) |
| `/book` | `BookingCatalogComponent` | Каталог типов событий (скриншот 02) |
| `/book/:eventTypeId` | `BookingWizardComponent` | Wizard бронирования (Step 1-2, скриншот 03) |
| `/book/:eventTypeId/confirm` | `GuestInfoStepComponent` | Step 3: ввод контактных данных |
| `/admin/calendar` | `AdminCalendarComponent` | Админ: календарная сетка |
| `/admin/event-types` | `EventTypesManagerComponent` | Админ: управление типами событий |

---

## 3. Модели данных

### EventType
```typescript
export interface EventType {
  id: string;              // Строковый ID, readonly
  name: string;
  description: string;
  durationMinutes: number;
  color: string;           // HEX цвет, например "#ff9800"
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
```

### Booking
```typescript
export interface Booking {
  id: string;
  eventTypeId: string;
  startTime: string;       // ISO 8601 с локальным timezone
  guestName?: string;      // Опционально
  guestContact?: string;   // Конкатенация email + phone + notes
}

export interface CreateBookingRequest {
  eventTypeId: string;
  startTime: string;
  guestName?: string;
  guestContact?: string;   // "Email: xxx, Phone: yyy, Notes: zzz"
}

// Внутренняя модель для формы
export interface GuestContactForm {
  email?: string;
  phone?: string;
  notes?: string;
}
```

### AvailableSlot
```typescript
export interface AvailableSlot {
  startTime: string;       // ISO 8601
  endTime: string;
}
```

### CalendarOwner
```typescript
export interface CalendarOwner {
  id: string;
  name: string;
  contact: string;
}
```

### ConflictError
```typescript
export interface ConflictError {
  message: string;
}
```

---

## 4. Feature: Home (Главная страница)

### Компоненты
```
HomeComponent
├── HeaderComponent (shared)
├── HeroSectionComponent
│   ├── Badge: "БЫСТРАЯ ЗАПИСЬ НА ЗВОНОК"
│   ├── Title: "Calendar"
│   ├── Description
│   └── CTA Button: "Записаться"
└── FeaturesCardComponent
    └── Bullet list возможностей
```

### Angular Material
- `MatToolbar` — header
- `MatButton` — CTA кнопки
- `MatCard` — карточка возможностей

---

## 5. Feature: Booking (Сценарий бронирования)

### 5.1 BookingCatalogComponent (`/book`)
```
BookingCatalogComponent
├── HeaderComponent (shared)
├── OwnerProfileHeaderComponent (shared)
│   ├── Avatar
│   ├── Name: "Tota"
│   └── Role: "Host"
├── Title: "Выберите тип события"
├── Subtitle
└── EventTypeListComponent
    └── EventTypeCardComponent[]
        ├── Name
        ├── Description
        └── Duration Badge (MatChip)
```

### 5.2 BookingWizardComponent (`/book/:eventTypeId`)

**Step 1-2 в одном компоненте:**
```
BookingWizardComponent (контейнер)
├── EventTypeSummaryComponent (Step 1)
│   ├── OwnerProfileHeader
│   ├── Event type info (name, duration, description)
│   └── Selected date display
├── CalendarSlotStepComponent (Step 2)
│   ├── CalendarWidgetComponent
│   │   └── angular-calendar (month view)
│   └── SlotPickerComponent
│       ├── Slot list (MatList)
│       ├── Status badges ("Занято" | "Свободно")
│       └── Navigation buttons
└── [Continue] → /book/:eventTypeId/confirm
```

**State Management (Signals):**
```typescript
bookingState = {
  selectedEventType: Signal<EventType | null>,
  selectedDate: Signal<Date | null>,
  selectedSlot: Signal<AvailableSlot | null>
}
```

### 5.3 GuestInfoStepComponent (`/book/:eventTypeId/confirm`)
```
GuestInfoStepComponent
├── SummaryPanel
│   ├── Event type info
│   ├── Selected date/time
│   └── Selected slot
├── GuestContactFormComponent
│   ├── Email input (optional, email validation)
│   ├── Phone input (optional, phone validation)
│   ├── Notes textarea (optional, max 500 chars)
│   └── Validation: all fields optional
└── Actions
    ├── [Назад]
    ├── [Пропустить] — submit without contact
    └── [Забронировать] — submit with contact
```

**Логика конкатенации контакта:**
```typescript
concatenateContact(formValue: GuestContactForm): string | undefined {
  const parts: string[] = [];
  if (formValue.email) parts.push(`Email: ${formValue.email}`);
  if (formValue.phone) parts.push(`Phone: ${formValue.phone}`);
  if (formValue.notes) parts.push(`Notes: ${formValue.notes}`);
  return parts.length > 0 ? parts.join(', ') : undefined;
}
```

### Angular Material
- `MatCard` — карточки
- `MatChips` — бейджи длительности
- `MatList` — список слотов
- `MatButton` (raised/outline) — навигация
- `MatFormField` + `MatInput` — поля формы
- `MatStepper` (опционально) — wizard steps

### Кастомные валидаторы
```typescript
// Phone validator (shared/validators/phone.validator.ts)
export function phoneValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  const phoneRegex = /^[+]?[\d\s\-()]{7,20}$/;
  return phoneRegex.test(control.value) ? null : { invalidPhone: true };
}
```

---

## 6. Feature: Admin (Администрирование)

### 6.1 AdminCalendarComponent (`/admin/calendar`)
```
AdminCalendarComponent
├── AdminHeaderComponent
│   ├── Title
│   ├── Month navigation [<] [>]
│   └── Links: [Календарь] [Типы событий]
├── CalendarGridViewComponent
│   ├── CalendarHeaderComponent
│   │   └── Month/Year display
│   ├── angular-calendar (month view)
│   │   └── Custom event template с цветами типов событий
│   └── BookingEventCardComponent (mini-card в ячейке)
│       ├── Time
│       ├── Guest name (или truncated)
│       └── Color indicator
└── BookingDetailDialogComponent (on click)
    ├── Booking details
    ├── Guest info
    └── Event type info
```

**Цветовая схема:**
- Цвет события берётся из `EventType.color`
- Все события одного типа имеют одинаковый цвет

### 6.2 EventTypesManagerComponent (`/admin/event-types`)
```
EventTypesManagerComponent
├── PageHeaderComponent
│   ├── Title: "Управление типами событий"
│   └── [Создать тип] button (MatButton)
├── EventTypeListComponent
│   └── EventTypeCardComponent[]
│       ├── ColorIndicator (circle with color)
│       ├── Name
│       ├── Description
│       ├── Duration badge
│       └── Actions: [Редактировать] (MatIconButton)
└── EventTypeDialogComponent (create/edit)
    ├── MatDialogTitle: "Создать тип" / "Редактировать тип"
    ├── Form:
    │   ├── name (MatInput, required)
    │   ├── description (MatInput, required)
    │   ├── durationMinutes (MatInput, number, required)
    │   └── color (Color Picker, required)
    │       └── ngx-color-picker integration
    ├── Error handling:
    │   └── 409 Conflict: "Невозможно изменить длительность: есть активные бронирования"
    └── Footer:
        ├── [Отмена]
        └── [Сохранить] (disabled until form valid)
```

### Angular Material + Color Picker
- `MatTable` или `MatList` — список типов
- `MatDialog` — форма создания/редактирования
- `MatFormField`, `MatInput`, `MatButton`
- `ngx-color-picker` — выбор цвета
- `MatSnackBar` — ошибка 409

---

## 7. Сервисы (API Layer)

### BookingApiService (публичное API)
```typescript
@Injectable({ providedIn: 'root' })
export class BookingApiService {
  // Получить все типы событий
  getEventTypes(): Observable<EventType[]>;
  
  // Получить один тип события
  getEventType(id: string): Observable<EventType>;
  
  // Получить свободные слоты на дату
  getAvailableSlots(eventTypeId: string, date: string): Observable<AvailableSlot[]>;
  
  // Создать бронирование
  createBooking(request: CreateBookingRequest): Observable<Booking | ConflictError>;
  
  // Получить профиль владельца
  getOwner(): Observable<CalendarOwner>;
}
```

### AdminApiService (администрирование)
```typescript
@Injectable({ providedIn: 'root' })
export class AdminApiService {
  // Получить все бронирования
  getBookings(): Observable<Booking[]>;
  
  // Получить все типы событий
  getEventTypes(): Observable<EventType[]>;
  
  // Создать тип события
  createEventType(request: CreateEventTypeRequest): Observable<EventType>;
  
  // Обновить тип события (409 если есть бронирования и меняется duration)
  updateEventType(request: UpdateEventTypeRequest): Observable<EventType | ConflictError>;
}
```

### BookingStateService (Signals)
```typescript
@Injectable({ providedIn: 'root' })
export class BookingStateService {
  // State
  readonly selectedEventType = signal<EventType | null>(null);
  readonly selectedDate = signal<Date | null>(null);
  readonly selectedSlot = signal<AvailableSlot | null>(null);
  readonly guestInfo = signal<GuestContactForm | null>(null);
  
  // Computed
  readonly canProceedToConfirm = computed(() => this.selectedSlot() !== null);
  readonly isComplete = computed(() => {
    return this.selectedEventType() && 
           this.selectedDate() && 
           this.selectedSlot();
  });
  
  // Methods
  selectEventType(eventType: EventType): void;
  selectDate(date: Date): void;
  selectSlot(slot: AvailableSlot): void;
  setGuestInfo(info: GuestContactForm): void;
  reset(): void;
}
```

### ContactFormatterService
```typescript
@Injectable({ providedIn: 'root' })
export class ContactFormatterService {
  format(guestContact: GuestContactForm): string | undefined {
    const parts: string[] = [];
    if (guestContact.email) parts.push(`Email: ${guestContact.email}`);
    if (guestContact.phone) parts.push(`Phone: ${guestContact.phone}`);
    if (guestContact.notes) parts.push(`Notes: ${guestContact.notes}`);
    return parts.length > 0 ? parts.join(', ') : undefined;
  }
}
```

### TimezoneUtils (Helper)
```typescript
export class TimezoneUtils {
  // Форматировать для отображения в локальном поясе
  static formatLocal(date: string | Date): string;
  
  // Конвертировать в ISO 8601 для API
  static toISOString(date: Date): string;
  
  // Получить текущий timezone пользователя
  static getUserTimezone(): string;
}
```

---

## 8. Shared Components

### HeaderComponent
```typescript
@Component({
  selector: 'app-header'
})
export class HeaderComponent {
  // Logo + [Записаться] [Админка]
}
```

### OwnerProfileHeaderComponent
```typescript
@Component({
  selector: 'app-owner-profile-header'
})
export class OwnerProfileHeaderComponent {
  @Input() owner: CalendarOwner;
  // Avatar + Name + "Host"
}
```

### EventTypeCardComponent
```typescript
@Component({
  selector: 'app-event-type-card'
})
export class EventTypeCardComponent {
  @Input() eventType: EventType;
  @Output() select = new EventEmitter<EventType>();
  // Clickable card с цветом (если применяется)
}
```

---

## 9. Валидация форм

### Guest Contact Form
| Поле | Обязательное | Валидация |
|------|--------------|-----------|
| email | Нет | Validators.email (формат email) |
| phone | Нет | phoneValidator (regex: `[+]?[\d\s\-()]{7,20}`) |
| notes | Нет | Validators.maxLength(500) |

### Event Type Form
| Поле | Обязательное | Валидация |
|------|--------------|-----------|
| name | Да | Validators.required, minLength(2) |
| description | Да | Validators.required |
| durationMinutes | Да | Validators.required, min(1), max(480) |
| color | Да | Validators.required, pattern HEX color |

---

## 10. Обработка ошибок

### HTTP Errors
- **400** — Bad Request (невалидные данные)
- **404** — Not Found (тип события не существует)
- **409** — Conflict:
  - При создании бронирования: слот занят
  - При обновлении типа события: есть бронирования, нельзя менять duration

### UI Feedback
- `MatSnackBar` для отображения ошибок
- Inline validation errors в формах
- Disable submit buttons при невалидной форме

---

## 11. Часовые пояса

**Принцип:** Используем локальный часовой пояс пользователя.

- **Отображение:** Все даты/время показываем в локальном timezone пользователя
- **API:** Отправляем ISO 8601 строки (содержат timezone offset)
- **Библиотека:** `date-fns-tz` для работы с timezone

```typescript
// Пример
const userDate = new Date(); // локальное время пользователя
const isoString = userDate.toISOString(); // "2026-04-08T14:30:00.000Z"
// Отправляем isoString на backend
```

---

## 12. Зависимости (package.json)

```json
{
  "dependencies": {
    "@angular/core": "^21.0.0",
    "@angular/material": "^21.0.0",
    "@angular/cdk": "^21.0.0",
    "@angular/forms": "^21.0.0",
    "angular-calendar": "^0.31.0",
    "ngx-color-picker": "^17.0.0",
    "date-fns": "^3.0.0",
    "date-fns-tz": "^3.0.0",
    "rxjs": "^7.8.0"
  },
  "devDependencies": {
    "@angular/cli": "^21.0.0",
    "@angular/compiler-cli": "^21.0.0"
  }
}
```

---

## 13. Файловая структура (полная)

```
frontend/src/app/
├── core/
│   ├── models/
│   │   ├── event-type.model.ts
│   │   ├── booking.model.ts
│   │   ├── slot.model.ts
│   │   └── owner.model.ts
│   ├── services/
│   │   ├── booking-api.service.ts
│   │   ├── admin-api.service.ts
│   │   └── owner-api.service.ts
│   ├── state/
│   │   └── booking-state.service.ts
│   ├── utils/
│   │   └── timezone.utils.ts
│   └── interceptors/
│       └── error.interceptor.ts
│
├── features/
│   ├── home/
│   │   ├── home.component.ts
│   │   ├── home.component.html
│   │   ├── home.component.scss
│   │   ├── hero-section.component.ts
│   │   └── features-card.component.ts
│   │
│   ├── booking/
│   │   ├── booking.routes.ts
│   │   ├── booking.module.ts
│   │   ├── components/
│   │   │   ├── owner-profile-header/
│   │   │   │   └── owner-profile-header.component.ts
│   │   │   └── event-type-card/
│   │   │       └── event-type-card.component.ts
│   │   ├── booking-catalog/
│   │   │   ├── booking-catalog.component.ts
│   │   │   └── booking-catalog.component.html
│   │   └── booking-wizard/
│   │       ├── booking-wizard.component.ts
│   │       ├── event-type-summary/
│   │       │   └── event-type-summary.component.ts
│   │       ├── calendar-slot-step/
│   │       │   ├── calendar-slot-step.component.ts
│   │       │   ├── calendar-widget/
│   │       │   │   └── calendar-widget.component.ts
│   │       │   └── slot-picker/
│   │       │       └── slot-picker.component.ts
│   │       └── guest-info-step/
│   │           ├── guest-info-step.component.ts
│   │           └── guest-contact-form/
│   │               └── guest-contact-form.component.ts
│   │
│   └── admin/
│       ├── admin.routes.ts
│       ├── admin.module.ts
│       ├── components/
│       │   └── admin-header/
│       │       └── admin-header.component.ts
│       ├── admin-calendar/
│       │   ├── admin-calendar.component.ts
│       │   ├── calendar-grid-view/
│       │   │   ├── calendar-grid-view.component.ts
│       │   │   ├── calendar-header/
│       │   │   │   └── calendar-header.component.ts
│       │   │   └── booking-event-card/
│       │   │       └── booking-event-card.component.ts
│       │   └── booking-detail-dialog/
│       │       └── booking-detail-dialog.component.ts
│       └── event-types-manager/
│           ├── event-types-manager.component.ts
│           ├── event-type-list/
│           │   └── event-type-list.component.ts
│           ├── event-type-card/
│           │   └── event-type-card.component.ts
│           └── event-type-dialog/
│               └── event-type-dialog.component.ts
│
├── shared/
│   ├── components/
│   │   └── header/
│   │       └── header.component.ts
│   ├── validators/
│   │   └── phone.validator.ts
│   └── material/
│       └── material.module.ts
│
├── app.component.ts
├── app.component.html
├── app.routes.ts
└── app.config.ts
```

---

## 14. Чек-лист реализации

### Этап 1: Настройка
- [ ] Установить Angular CLI и создать проект
- [ ] Установить Angular Material
- [ ] Установить angular-calendar, date-fns, ngx-color-picker
- [ ] Настроить Material тему с кастомными цветами
- [ ] Создать структуру папок

### Этап 2: Core
- [ ] Создать модели (models/)
- [ ] Создать API сервисы
- [ ] Создать BookingStateService
- [ ] Создать кастомные валидаторы
- [ ] Создать timezone utils

### Этап 3: Home
- [ ] HeaderComponent
- [ ] HeroSectionComponent
- [ ] FeaturesCardComponent
- [ ] HomeComponent + маршрут

### Этап 4: Booking Catalog
- [ ] OwnerProfileHeaderComponent
- [ ] EventTypeCardComponent
- [ ] BookingCatalogComponent + маршрут

### Этап 5: Booking Wizard
- [ ] EventTypeSummaryComponent
- [ ] CalendarWidgetComponent (angular-calendar)
- [ ] SlotPickerComponent
- [ ] BookingWizardComponent + маршрут

### Этап 6: Guest Info
- [ ] GuestContactFormComponent
- [ ] GuestInfoStepComponent + маршрут

### Этап 7: Admin Calendar
- [ ] AdminHeaderComponent
- [ ] CalendarGridViewComponent
- [ ] BookingEventCardComponent
- [ ] BookingDetailDialogComponent
- [ ] AdminCalendarComponent + маршрут

### Этап 8: Admin Event Types
- [ ] EventTypeListComponent
- [ ] EventTypeCardComponent (admin version)
- [ ] EventTypeDialogComponent (create/edit + color picker)
- [ ] EventTypesManagerComponent + маршрут

### Этап 9: Тестирование
- [ ] Проверить wizard flow
- [ ] Проверить валидацию форм
- [ ] Проверить обработку 409 ошибок
- [ ] Проверить работу с часовыми поясами
- [ ] Проверить цвета в календаре

---

## Приложение: API Endpoints Reference

| Endpoint | Метод | Описание | Компонент |
|----------|-------|----------|-----------|
| `/api/event-types` | GET | Список всех типов | BookingCatalog, EventTypesManager |
| `/api/event-types/:id` | GET | Один тип события | BookingWizard |
| `/api/event-types` | POST | Создать тип (admin) | EventTypeDialog (create) |
| `/api/event-types` | PUT | Обновить тип (admin, 409 при конфликте) | EventTypeDialog (edit) |
| `/api/bookings/available-slots` | GET | Свободные слоты | BookingWizard |
| `/api/bookings` | POST | Создать бронирование (409 при конфликте) | GuestInfoStep |
| `/api/bookings` | GET | Все бронирования (admin) | AdminCalendar |
| `/api/owner` | GET | Профиль владельца | BookingCatalog |

---

*Документ актуален на дату создания: 2026-04-08*
