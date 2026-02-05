-- Todo App Forever Database Schema
-- Run this in Supabase SQL Editor

CREATE TABLE todos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT false,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  due_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- Policy: Allow all operations (public access for demo)
CREATE POLICY "Enable all access for todos" ON todos
  FOR ALL USING (true);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to call the function before each update
CREATE TRIGGER update_todos_updated_at 
  BEFORE UPDATE ON todos
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Indexes for performance
CREATE INDEX idx_todos_completed ON todos(completed);
CREATE INDEX idx_todos_created_at ON todos(created_at DESC);
CREATE INDEX idx_todos_priority ON todos(priority);
CREATE INDEX idx_todos_due_date ON todos(due_date);

-- Insert some sample data for testing
INSERT INTO todos (title, description, priority, due_date) VALUES 
('Создать todo приложение', 'Разработать современное приложение для управления задачами', 'high', CURRENT_DATE + INTERVAL '3 days'),
('Изучить React Hooks', 'Углубиться в изучение useState, useEffect и других хуков', 'medium', CURRENT_DATE + INTERVAL '1 week'),
('Купить продукты', 'Молоко, хлеб, яйца, фрукты', 'low', CURRENT_DATE + INTERVAL '1 day'),
('Сделать зарядку', 'Утренняя зарядка 30 минут', 'medium', CURRENT_DATE);