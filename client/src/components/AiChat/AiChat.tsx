'use client';
import { useState, useRef, useEffect } from 'react';
import Script from 'next/script';
import './iaflow.css';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface AIModel {
  id: string;
  name: string;
  icon: string;
  description: string;
  provider: 'Claude' | 'Gemini';
}

declare global {
  interface Window {
    puter?: {
      ai: {
        chat: (
          prompt: string,
          options?: {
            model?: string;
            stream?: boolean;
          },
        ) => Promise<{
          message?: {
            content: Array<{ text: string }> | string;
          };
          content?: string;
        }>;
      };
    };
  }
}

const AI_MODELS: AIModel[] = [
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    icon: '⚡',
    description: 'Быстрый и бесплатный',
    provider: 'Claude',
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    icon: '🤖',
    description: 'Сильный и умный',
    provider: 'Claude',
  },
  {
    id: 'claude-3-haiku',
    name: 'Claude 3 Haiku',
    icon: '🌪',
    description: 'Очень быстрый',
    provider: 'Claude',
  },
  {
    id: 'claude-3-sonnet',
    name: 'Claude 3 Sonnet',
    icon: '🎼',
    description: 'Баланс скорости и качества',
    provider: 'Claude',
  },
  {
    id: 'gemini-1.5-flash',
    name: 'Gemini 1.5 Flash',
    icon: '✨',
    description: 'Быстрый Google-бот',
    provider: 'Gemini',
  },
];

export default function FlowerChat() {
  const [question, setQuestion] = useState('');
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [isAsking, setIsAsking] = useState(false);
  const [isPuterReady, setIsPuterReady] = useState(false);
  // ИЗМЕНЕНИЕ 1: Установка модели по умолчанию на 'claude-haiku-4-5'
  const [selectedModel, setSelectedModel] = useState('claude-opus-4');
  const [showModelSelector, setShowModelSelector] = useState(false);
  const suggestions = [
    'Какие цветы самые долговечные в букете?',
    'Как ухаживать за розами дома?',
    'Как выбрать букет для подарка?',
  ];

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat, isAsking]);

  // Проверяем готовность Puter каждые 100ms
  useEffect(() => {
    const checkPuter = setInterval(() => {
      if (window.puter && window.puter.ai) {
        setIsPuterReady(true);
        clearInterval(checkPuter);
        console.log('✅ Puter SDK загружен');
      }
    }, 100);

    const timeout = setTimeout(() => {
      clearInterval(checkPuter);
      if (!isPuterReady) {
        console.error('❌ Puter SDK не загрузился за 10 секунд');
      }
    }, 10000);

    return () => {
      clearInterval(checkPuter);
      clearTimeout(timeout);
    };
  }, [isPuterReady]);

  // ИЗМЕНЕНИЕ 2: Добавление проверки !isPuterReady для предотвращения двойного вызова
  const handlePuterLoad = () => {
    console.log('📦 Puter скрипт загружен, проверяем доступность API...');
    setTimeout(() => {
      // Устанавливаем статус готовности только если он еще не был установлен
      if (window.puter && window.puter.ai && !isPuterReady) {
        setIsPuterReady(true);
        console.log('✅ Puter API готов');
      }
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      ask();
    }
  };

  const setSuggestion = (text: string) => {
    setQuestion(text);
  };

  // --- ФУНКЦИЯ ОТПРАВКИ ЗАПРОСА В ЧАТ ---
  const ask = async () => {
    if (!window.puter || !window.puter.ai || !question.trim() || isAsking) {
      console.warn('⚠️ Условия не выполнены:', {
        puter: !!window.puter,
        ai: !!(window.puter && window.puter.ai),
        question: question.trim(),
        isAsking,
      });
      return;
    }

    const userQuestion = question.trim();
    setQuestion('');
    const userMessage: ChatMessage = { role: 'user', content: userQuestion };
    setChat((prev) => [...prev, userMessage]);
    setIsAsking(true);

    try {
      console.log(`🤖 Отправка запроса в ${selectedModel}...`);
      const recentChat = chat.slice(-10);
      const context = recentChat
        .map((msg) => `${msg.role === 'user' ? 'Пользователь' : 'Ассистент'}: ${msg.content}`)
        .join('\n');

      const fullPrompt = context
        ? `${context}\nПользователь: ${userQuestion}\n\nТы - виртуальный флорист. Отвечай кратко, по делу, дружелюбно.`
        : `Пользователь: ${userQuestion}\n\nТы - виртуальный флорист. Отвечай кратко, по делу, дружелюбно.`;

      const res = await window.puter.ai.chat(fullPrompt, {
        model: selectedModel,
      });

      console.log('✅ Получен ответ:', res);
      let responseText = '';
      if (res.message?.content) {
        if (Array.isArray(res.message.content)) {
          responseText = res.message.content[0]?.text || '';
        } else if (typeof res.message.content === 'string') {
          responseText = res.message.content;
        }
      } else if (res.content) {
        responseText = res.content;
      }

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: responseText || 'Извините, не удалось получить ответ.',
      };
      setChat((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error('❌ Ошибка AI:', err);
      setChat((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `❌ Ошибка связи с AI: ${
            err instanceof Error ? err.message : 'Неизвестная ошибка'
          }`,
        },
      ]);
    } finally {
      setIsAsking(false);
    }
  };

  const currentModel = AI_MODELS.find((m) => m.id === selectedModel);
  const isButtonDisabled = !question.trim() || isAsking || !isPuterReady;

  return (
    <div className="fc-page">
      <Script
        src="https://js.puter.com/v2/"
        strategy="afterInteractive"
        onLoad={handlePuterLoad}
        onError={(e) => {
          console.error('❌ Ошибка загрузки Puter SDK:', e);
        }}
      />

      <div className="fc-wrapper">
        <header className="fc-header">
          <h1 className="fc-title">
            <span className="fc-emoji">🌸</span>
            Виртуальный флорист
            <span className="fc-emoji">💐</span>
          </h1>
          <p className="fc-subtitle">Спросите меня о цветах, букетах и уходе за растениями</p>
          {/* Селектор модели */}
          <div className="fc-model-selector">
            <button
              onClick={() => setShowModelSelector(!showModelSelector)}
              className="fc-model-btn"
              disabled={!isPuterReady}>
              <span className="fc-model-icon">{currentModel?.icon}</span>
              <span className="fc-model-name">{currentModel?.name}</span>
              <span className="fc-dropdown-arrow">{showModelSelector ? '▲' : '▼'}</span>
            </button>
            {showModelSelector && (
              <div className="fc-model-dropdown">
                {AI_MODELS.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => {
                      setSelectedModel(model.id);
                      setShowModelSelector(false);
                    }}
                    className={`fc-model-option ${
                      selectedModel === model.id ? 'fc-model-active' : ''
                    }`}>
                    <span className="fc-model-icon">{model.icon}</span>
                    <div className="fc-model-info">
                      <div className="fc-model-title">{model.name}</div>
                      <div className="fc-model-desc">{model.description}</div>
                    </div>
                    {selectedModel === model.id && <span className="fc-check">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </header>

        <div className="fc-messages">
          {chat.length === 0 && (
            <div className="fc-empty">
              <div className="fc-empty-icon">🌺</div>
              <p className="fc-empty-text">Начните беседу с вопроса о цветах!</p>

              {/* Используем динамически сгенерированные подсказки */}
              <div className="fc-suggestions">
                {suggestions.length > 0 ? (
                  suggestions.map((text, index) => (
                    <button
                      key={index}
                      onClick={() => setSuggestion(text)}
                      className="fc-suggest-btn"
                      disabled={!isPuterReady}>
                      {text}
                    </button>
                  ))
                ) : (
                  // Заглушка, пока подсказки генерируются или Puter не готов
                  <div className="fc-suggest-placeholder">
                    {isPuterReady ? 'Генерация подсказок...' : 'Подсказки загружаются...'}
                  </div>
                )}
              </div>
            </div>
          )}
          {chat.map((msg, i) => (
            <div key={i} className={`fc-msg fc-msg-${msg.role}`}>
              <div className="fc-msg-icon">{msg.role === 'user' ? '👤' : '🌻'}</div>
              <div className="fc-msg-content">{msg.content}</div>
            </div>
          ))}
          {isAsking && (
            <div className="fc-msg fc-msg-assistant">
              <div className="fc-msg-icon">🌻</div>
              <div className="fc-loader">
                <span>●</span>
                <span>●</span>
                <span>●</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef}></div>
        </div>

        <div className="fc-input-box">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Спросите о цветах..."
            disabled={isAsking || !isPuterReady}
            className="fc-textarea"
            rows={2}
          />
          <button onClick={ask} disabled={isButtonDisabled} className="fc-send-btn">
            {isAsking ? '⏳ Думаю...' : isPuterReady ? '🌸 Отправить' : '⏳ Загрузка...'}
          </button>
        </div>
      </div>
    </div>
  );
}
