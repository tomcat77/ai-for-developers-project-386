import { test, expect } from '@playwright/test';

test.describe('Создание типа события', () => {
  test.beforeEach(async ({ page }) => {
    // Открыть страницу управления типами событий перед каждым тестом
    await page.goto('/admin/event-types');
    
    // Дождаться загрузки страницы
    await expect(page.getByText('Управление типами событий')).toBeVisible();
  });

  test('успешное создание нового типа события', async ({ page }) => {
    // Шаг 2: Нажать кнопку создания типа события
    await page.getByRole('button', { name: /Создать тип/i }).click();
    
    // Ожидаемый результат: Открывается диалог с заголовком "Создать тип события"
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText('Создать тип события')).toBeVisible();
    
    // Проверка наличия полей формы
    await expect(page.getByLabel('Название')).toBeVisible();
    await expect(page.getByLabel('Описание')).toBeVisible();
    await expect(page.getByLabel('Длительность (минуты)')).toBeVisible();
    await expect(page.getByRole('button', { name: /Отмена/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Сохранить/i })).toBeVisible();
    
    // Проверка: кнопка "Сохранить" неактивна при невалидной форме (пустые поля)
    const saveButton = page.getByRole('button', { name: /Сохранить/i });
    await expect(saveButton).toBeDisabled();
    
    // Шаг 3: Заполнить поле "Название" (используем уникальное имя)
    await page.getByLabel('Название').fill('Интервью с HR');
    await expect(page.getByLabel('Название')).toHaveValue('Интервью с HR');
    
    // Шаг 4: Заполнить поле "Описание"
    await page.getByLabel('Описание').fill('Первичное собеседование с кандидатом');
    await expect(page.getByLabel('Описание')).toHaveValue('Первичное собеседование с кандидатом');
    
    // Шаг 5: Заполнить поле "Длительность (минуты)"
    await page.getByLabel('Длительность (минуты)').press('Meta+a');
    await page.getByLabel('Длительность (минуты)').fill('45');
    await expect(page.getByLabel('Длительность (минуты)')).toHaveValue('45');
    
    // Шаг 6: Проверить цвет (по умолчанию #ff9800)
    const colorInput = page.locator('input[type="color"]');
    await expect(colorInput).toHaveValue('#ff9800');
    
    // Теперь форма валидна и кнопка сохранения активна
    await expect(saveButton).toBeEnabled();
    
    // Шаг 7: Нажать кнопку "Сохранить"
    await saveButton.click();
    
    // Ожидаемый результат: Диалог закрывается
    await expect(page.getByRole('dialog')).not.toBeVisible();
    
    // Ожидаемый результат: Отображается уведомление (snackbar)
    await expect(page.getByText('Тип события создан')).toBeVisible();
    
    // Ожидаемый результат: Новый тип события отображается в списке
    // Используем более конкретный локатор для проверки карточки нового типа события
    const newEventCard = page.locator('mat-card').filter({ hasText: 'Интервью с HR' });
    await expect(newEventCard).toBeVisible();
    await expect(newEventCard.getByText('Первичное собеседование с кандидатом')).toBeVisible();
    await expect(newEventCard.getByText('45 мин')).toBeVisible();
  });

  test('валидация: незаполненные обязательные поля', async ({ page }) => {
    // Открыть диалог создания
    await page.getByRole('button', { name: /Создать тип/i }).click();
    
    // Проверка: кнопка "Сохранить" неактивна при невалидной форме
    const saveButton = page.getByRole('button', { name: /Сохранить/i });
    await expect(saveButton).toBeDisabled();
    
    // Нажать на поле "Название" и убрать фокус для проверки ошибки валидации
    const nameField = page.getByLabel('Название');
    await nameField.focus();
    await nameField.blur();
    
    // Проверка ошибки для Названия: "Название обязательно"
    await expect(page.getByText('Название обязательно')).toBeVisible();
    
    // Нажать на поле "Описание" и убрать фокус
    const descriptionField = page.getByLabel('Описание');
    await descriptionField.focus();
    await descriptionField.blur();
    
    // Проверка ошибки для Описания: "Описание обязательно"
    await expect(page.getByText('Описание обязательно')).toBeVisible();
    
    // Нажать на поле "Длительность" и убрать фокус
    const durationField = page.getByLabel('Длительность (минуты)');
    await durationField.focus();
    await durationField.fill('');
    await durationField.blur();
    
    // Проверка ошибки для Длительности: "Длительность обязательна"
    await expect(page.getByText('Длительность обязательна')).toBeVisible();
    
    // Проверка: кнопка сохранения всё ещё неактивна
    await expect(saveButton).toBeDisabled();
  });

  test('валидация: минимальная длина названия', async ({ page }) => {
    // Открыть диалог создания
    await page.getByRole('button', { name: /Создать тип/i }).click();
    
    // Ввести 1 символ в поле "Название"
    const nameField = page.getByLabel('Название');
    await nameField.fill('A');
    await nameField.blur();
    
    // Проверка ошибки: "Минимум 2 символа"
    await expect(page.getByText('Минимум 2 символа')).toBeVisible();
    
    // Проверка: кнопка сохранения неактивна
    const saveButton = page.getByRole('button', { name: /Сохранить/i });
    await expect(saveButton).toBeDisabled();
  });

  test('валидация: границы длительности', async ({ page }) => {
    // Открыть диалог создания
    await page.getByRole('button', { name: /Создать тип/i }).click();
    
    // Заполнить название и описание для валидности формы
    await page.getByLabel('Название').fill('Тест');
    await page.getByLabel('Описание').fill('Тестовое описание');
    
    // Тест: значение < 1
    const durationField = page.getByLabel('Длительность (минуты)');
    await durationField.fill('0');
    await durationField.blur();
    
    // Проверка ошибки: "Минимум 1 минута"
    await expect(page.getByText('Минимум 1 минута')).toBeVisible();
    
    // Проверка: кнопка сохранения неактивна
    const saveButton = page.getByRole('button', { name: /Сохранить/i });
    await expect(saveButton).toBeDisabled();
    
    // Тест: значение > 480
    await durationField.fill('481');
    await durationField.blur();
    
    // Проверка ошибки: "Максимум 480 минут"
    await expect(page.getByText('Максимум 480 минут')).toBeVisible();
    
    // Проверка: кнопка сохранения неактивна
    await expect(saveButton).toBeDisabled();
  });

  test('отмена создания типа события', async ({ page }) => {
    // Открыть диалог создания
    await page.getByRole('button', { name: /Создать тип/i }).click();
    
    // Заполнить поля
    await page.getByLabel('Название').fill('Тестовый тип');
    await page.getByLabel('Описание').fill('Описание тестового типа');
    
    // Нажать кнопку "Отмена"
    await page.getByRole('button', { name: /Отмена/i }).click();
    
    // Ожидаемый результат: Диалог закрывается
    await expect(page.getByRole('dialog')).not.toBeVisible();
    
    // Ожидаемый результат: Тип события не создан (не отображается в списке)
    await expect(page.getByText('Тестовый тип')).not.toBeVisible();
  });
});
