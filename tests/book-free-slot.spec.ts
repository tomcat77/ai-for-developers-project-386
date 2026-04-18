import { test, expect, Page } from '@playwright/test';
import { EventType, Booking, DaySlot } from '../frontend/src/app/core/models';

/**
 * Сценарий тестирования: Успешное бронирование свободного слота
 * 
 * Предусловия:
 * - Приложение запущено и доступно
 * - В системе создан хотя бы один тип события
 * - Для выбранного типа события есть свободные слоты в календаре
 * - Гость не авторизован в системе
 */

test.describe('Успешное бронирование свободного слота', () => {
  
  // Уникальные имена для типов событий в тесте
  const eventTypeName = 'Созвон 15 мин';
  const eventTypeDescription = 'Краткий созвон для обсуждения вопросов';
  const eventTypeDuration = 15;
  
  // Контактные данные для бронирования
  const guestName = 'Александр';
  const guestEmail = 'alex@example.com';
  const guestPhone = '+7 999 123-45-67';
  const guestNotes = 'Хотелось бы обсудить детали проекта';

  test.beforeEach(async ({ page }) => {
    // Создаем тип события перед тестом через админку
    await createEventType(page, {
      name: eventTypeName,
      description: eventTypeDescription,
      durationMinutes: eventTypeDuration,
      color: '#4caf50'
    });
  });

  test('полный flow бронирования с контактными данными', async ({ page }) => {
    // Шаг 1: Открыть страницу с видами брони
    await page.goto('/book');
    
    // Ожидаемый результат: Отображается список доступных типов событий
    await expect(page.getByText('Выберите тип события')).toBeVisible();
    
    // Проверяем наличие карточки с типом события (более точный селектор)
    const eventCard = page.locator('mat-card').filter({ hasText: eventTypeName });
    await expect(eventCard).toBeVisible();
    await expect(eventCard.getByText(eventTypeDescription)).toBeVisible();
    // Проверяем длительность через mat-chip (чтобы избежать дублирования с названием)
    await expect(eventCard.locator('mat-chip').getByText(`${eventTypeDuration} мин`)).toBeVisible();

    // Шаг 2 & 3: Выбрать тип события и перейти к выбору слота
    await page.locator('mat-card').filter({ hasText: eventTypeName }).click();
    
    // Ожидаемый результат: Открывается страница выбора даты и времени
    await expect(page.getByText('Запись на звонок')).toBeVisible();
    await expect(page.getByText(eventTypeName)).toBeVisible();

    // Шаг 4: Выбрать дату в календаре (сегодня или завтра)
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Выбираем завтрашний день, чтобы избежать проблем с текущим временем
    const targetDay = tomorrow.getDate();
    
    // Кликаем на день в календаре
    const dayCell = page.locator('.day-cell').filter({ hasText: targetDay.toString() }).first();
    await dayCell.click();
    
    // Ожидаемый результат: Выбранная дата отображается активной
    await expect(dayCell).toHaveClass(/selected/);

    // Ждем загрузки слотов
    await page.waitForTimeout(500);

    // Шаг 5: Выбрать свободный временной слот
    // Ищем первый доступный (не занятый) слот
    const availableSlot = page.locator('mat-list-option').filter({ hasNot: page.locator('.slot-status') }).first();
    
    // Проверяем, что есть доступные слоты
    await expect(availableSlot).toBeVisible();
    
    // Получаем время слота для проверки позже
    const slotTimeText = await availableSlot.locator('span[matListItemTitle]').textContent();
    
    // Выбираем слот
    await availableSlot.click();
    
    // Ожидаемый результат: Слот выделен (проверяем через aria-selected), кнопка "Продолжить" активна
    await expect(availableSlot).toHaveAttribute('aria-selected', 'true');
    
    // Кликаем "Продолжить" для перехода к подтверждению
    await page.getByRole('button', { name: /Продолжить/i }).click();
    
    // Ожидаемый результат: Открывается страница "Подтверждение"
    await expect(page.getByText('Подтверждение')).toBeVisible();
    
    // Проверяем детали бронирования
    await expect(page.getByText(`Событие:`)).toBeVisible();
    await expect(page.getByText('Дата:')).toBeVisible();
    await expect(page.getByText('Время:')).toBeVisible();
    await expect(page.getByText('Длительность:')).toBeVisible();
    // Проверяем длительность в контексте карточки (используем exact match)
    await expect(page.locator('mat-card').filter({ hasText: 'Детали бронирования' }).getByText(`${eventTypeDuration} мин`, { exact: true })).toBeVisible();
    
    // Проверяем наличие кнопок
    await expect(page.getByRole('button', { name: /Назад/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Пропустить/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Забронировать/i })).toBeVisible();

    // Шаг 6: Указать контактные данные
    await page.getByLabel('Указать контактные данные').check();
    
    // Заполняем поля контактных данных
    await page.getByLabel('Имя').fill(guestName);
    await expect(page.getByLabel('Имя')).toHaveValue(guestName);
    
    await page.getByLabel('Email').fill(guestEmail);
    await expect(page.getByLabel('Email')).toHaveValue(guestEmail);
    
    await page.getByLabel('Телефон').fill(guestPhone);
    await expect(page.getByLabel('Телефон')).toHaveValue(guestPhone);
    
    await page.getByLabel('Заметки').fill(guestNotes);
    await expect(page.getByLabel('Заметки')).toHaveValue(guestNotes);

    // Шаг 8: Подтвердить бронирование
    await page.getByRole('button', { name: /Забронировать/i }).click();
    
    // Ожидаемый результат: Отображается уведомление об успехе
    await expect(page.getByText('Бронирование успешно создано!')).toBeVisible();
    
    // Ожидаемый результат: Отображается подтверждение с деталями
    await expect(page.getByText('Бронирование создано!')).toBeVisible();
    await expect(page.getByText('Вы успешно записались на звонок.')).toBeVisible();
    
    // Проверяем, что отображается дата и время бронирования
    const successDetails = page.locator('.details');
    await expect(successDetails).toBeVisible();
  });

  test('бронирование без контактных данных (пропуск)', async ({ page }) => {
    // Шаг 1: Открыть страницу с видами брони
    await page.goto('/book');
    
    // Шаг 2: Выбрать тип события (используем тип из beforeEach)
    await page.locator('mat-card').filter({ hasText: eventTypeName }).click();
    
    // Шаг 4: Выбрать дату в календаре (выбираем другой день, чтобы избежать конфликта с предыдущими тестами)
    const dayAfterTomorrow = new Date();
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
    const targetDay = dayAfterTomorrow.getDate();
    
    const dayCell = page.locator('.day-cell').filter({ hasText: targetDay.toString() }).first();
    await dayCell.click();
    await expect(dayCell).toHaveClass(/selected/);
    
    await page.waitForTimeout(800);

    // Шаг 5: Выбрать свободный слот
    const availableSlot = page.locator('mat-list-option').filter({ hasNot: page.locator('.slot-status') }).first();
    await expect(availableSlot).toBeVisible();
    await availableSlot.click();
    
    // Переходим к подтверждению
    await page.getByRole('button', { name: /Продолжить/i }).click();
    await expect(page.getByText('Подтверждение')).toBeVisible();

    // Шаг 7: Пропустить ввод контактов
    await page.getByRole('button', { name: /Пропустить/i }).click();
    
    // Ожидаемый результат: Бронирование создано без контактной информации
    // Ждем перехода на success screen
    await expect(page.getByText('Бронирование создано!')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Вы успешно записались на звонок.')).toBeVisible();
  });

  test('валидация: незаполненное поле "Имя" при активном чекбоксе', async ({ page }) => {
    // Шаг 1: Открыть страницу с видами брони
    await page.goto('/book');
    
    // Шаг 2: Выбрать тип события
    await page.locator('mat-card').filter({ hasText: eventTypeName }).click();
    
    // Шаг 4: Выбрать дату в календаре
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const targetDay = tomorrow.getDate();
    
    const dayCell = page.locator('.day-cell').filter({ hasText: targetDay.toString() }).first();
    await dayCell.click();
    await page.waitForTimeout(500);

    // Шаг 5: Выбрать свободный слот
    const availableSlot = page.locator('mat-list-option').filter({ hasNot: page.locator('.slot-status') }).first();
    await availableSlot.click();
    
    // Переходим к подтверждению
    await page.getByRole('button', { name: /Продолжить/i }).click();
    await expect(page.getByText('Подтверждение')).toBeVisible();

    // Активируем чекбокс контактных данных, но не заполняем имя
    await page.getByLabel('Указать контактные данные').check();
    
    // Ожидаемый результат: Кнопка "Забронировать" неактивна
    const bookButton = page.getByRole('button', { name: /Забронировать/i });
    await expect(bookButton).toBeDisabled();
    
    // Триггерим валидацию, убрав фокус с чекбокса
    await page.getByLabel('Имя').focus();
    await page.getByLabel('Имя').blur();
    
    // Ожидаемый результат: Отображается ошибка валидации
    await expect(page.getByText('Введите имя')).toBeVisible();
  });

  test('валидация: некорректный email', async ({ page }) => {
    // Шаг 1: Открыть страницу с видами брони
    await page.goto('/book');
    
    // Шаг 2: Выбрать тип события
    await page.locator('mat-card').filter({ hasText: eventTypeName }).click();
    
    // Шаг 4: Выбрать дату
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const targetDay = tomorrow.getDate();
    
    const dayCell = page.locator('.day-cell').filter({ hasText: targetDay.toString() }).first();
    await dayCell.click();
    await page.waitForTimeout(500);

    // Шаг 5: Выбрать свободный слот
    const availableSlot = page.locator('mat-list-option').filter({ hasNot: page.locator('.slot-status') }).first();
    await availableSlot.click();
    
    // Переходим к подтверждению
    await page.getByRole('button', { name: /Продолжить/i }).click();
    await expect(page.getByText('Подтверждение')).toBeVisible();

    // Активируем чекбокс и заполняем имя, но вводим некорректный email
    await page.getByLabel('Указать контактные данные').check();
    await page.getByLabel('Имя').fill(guestName);
    await page.getByLabel('Email').fill('invalid-email');
    
    // Триггерим валидацию
    await page.getByLabel('Email').blur();
    
    // Ожидаемый результат: Отображается ошибка валидации email
    await expect(page.getByText('Введите корректный email')).toBeVisible();
    
    // Ожидаемый результат: Кнопка "Забронировать" неактивна
    const bookButton = page.getByRole('button', { name: /Забронировать/i });
    await expect(bookButton).toBeDisabled();
  });
});

/**
 * Вспомогательная функция для создания типа события через API
 */
async function createEventType(
  page: Page, 
  eventType: { name: string; description: string; durationMinutes: number; color: string }
): Promise<string> {
  // Переходим в админку для создания типа события
  await page.goto('/admin/event-types');
  await page.waitForLoadState('networkidle');
  
  // Проверяем, существует ли уже такой тип события
  const existingCard = page.locator('mat-card').filter({ hasText: eventType.name });
  if (await existingCard.isVisible().catch(() => false)) {
    // Тип события уже существует
    return '';
  }
  
  // Нажимаем кнопку создания
  await page.getByRole('button', { name: /Создать тип/i }).click();
  
  // Заполняем форму
  await page.getByLabel('Название').fill(eventType.name);
  await page.getByLabel('Описание').fill(eventType.description);
  await page.getByLabel('Длительность (минуты)').fill(eventType.durationMinutes.toString());
  
  // Устанавливаем цвет через color input
  const colorInput = page.locator('input[type="color"]');
  await colorInput.fill(eventType.color);
  
  // Сохраняем
  await page.getByRole('button', { name: /Сохранить/i }).click();
  
  // Ждем закрытия диалога и появления уведомления
  await page.waitForSelector('mat-dialog-container', { state: 'hidden' });
  await expect(page.getByText('Тип события создан')).toBeVisible();
  
  // Возвращаемся на главную
  await page.goto('/');
  
  return '';
}
