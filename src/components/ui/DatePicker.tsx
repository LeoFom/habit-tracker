"use client";

import React from 'react';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import { Calendar } from 'lucide-react';

interface AntDatePickerProps {
  value?: string;
  onChange: (date: string) => void;
  placeholder?: string;
}

export function CustomAntDatePicker({ value, onChange, placeholder }: AntDatePickerProps) {
  return (
    <DatePicker
      // Настройка: запрещаем ввод текста, только выбор из календаря
      inputReadOnly={true}

      // Значение (переводим из твоей строки в объект dayjs)
      value={value ? dayjs(value) : null}

      // При выборе даты отправляем обратно ISO строку
      onChange={(date) => {
        onChange(date ? date.toISOString() : '');
      }}

      placeholder={placeholder}

      // Кастомизация стиля под твой проект
      className="input-antd-custom"
      style={{
        width: '100%',
        height: '42px', // подгони под высоту своих остальных инпутов
        borderRadius: 'var(--radius-md)',
      }}

      // Можно заменить стандартную иконку на твою из Lucide
      suffixIcon={<Calendar size={16} className="text-gray-400" />}
    />
  );
}