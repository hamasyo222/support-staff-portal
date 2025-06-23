import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  PaperAirplaneIcon,
  MicrophoneIcon,
  StopIcon,
  LanguageIcon,
  ExclamationTriangleIcon,
  UserIcon,
  ComputerDesktopIcon
} from '@heroicons/react/24/outline';
import { Button } from '../ui/Button';
import { aiConsultationService } from '../../services/aiConsultationService';
import { useAuthStore } from '../../stores/authStore';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  language: string;
  urgency?: string;
  suggestedActions?: string[];
}

export const AIConsultationChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('ja');
  const [sessionId] = useState(() => `session_${Date.now()}`);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<number | null>(null);

  const supportedLanguages = [
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'fil', name: 'Filipino', flag: '🇵🇭' },
    { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
    { code: 'th', name: 'ไทย', flag: '🇹🇭' },
    { code: 'my', name: 'မြန်မာ', flag: '🇲🇲' },
    { code: 'km', name: 'ខ្មែរ', flag: '🇰🇭' },
    { code: 'ne', name: 'नेपाली', flag: '🇳🇵' },
    { code: 'mn', name: 'Монгол', flag: '🇲🇳' }
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // 初期メッセージ
    const welcomeMessage: ChatMessage = {
      id: 'welcome',
      role: 'assistant',
      content: getWelcomeMessage(selectedLanguage),
      timestamp: new Date(),
      language: selectedLanguage
    };
    setMessages([welcomeMessage]);
  }, [selectedLanguage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getWelcomeMessage = (language: string): string => {
    const messages: Record<string, string> = {
      'ja': 'こんにちは！24時間対応のAI相談サービスです。お困りのことがあれば、お気軽にご相談ください。',
      'en': 'Hello! This is a 24/7 AI consultation service. Please feel free to ask if you have any concerns.',
      'vi': 'Xin chào! Đây là dịch vụ tư vấn AI 24/7. Hãy thoải mái hỏi nếu bạn có bất kỳ thắc mắc nào.',
      'zh': '您好！这是24小时AI咨询服务。如果您有任何问题，请随时咨询。',
      'fil': 'Kumusta! Ito ay 24/7 AI consultation service. Huwag mag-atubiling magtanong kung may mga alalahanin kayo.',
      'id': 'Halo! Ini adalah layanan konsultasi AI 24/7. Jangan ragu untuk bertanya jika Anda memiliki kekhawatiran.',
      'th': 'สวัสดี! นี่คือบริการปรึกษา AI ตลอด 24 ชั่วโมง โปรดอย่าลังเลที่จะถามหากคุณมีข้อกังวล',
      'my': 'မင်္ဂလာပါ! ၎င်းသည် ၂၄ နာရီ AI အကြံပေးဝန်ဆောင်မှုဖြစ်သည်။ သင့်တွင် စိုးရိမ်စရာများရှိပါက လွတ်လပ်စွာမေးမြန်းပါ။',
      'km': 'សួស្តី! នេះគឺជាសេវាកម្មប្រឹក្សា AI ២៤/៧។ សូមកុំរៀបរៀងក្នុងការសួរប្រសិនបើអ្នកមានការព្រួយបារម្ភ។',
      'ne': 'नमस्ते! यो २४/७ AI परामर्श सेवा हो। यदि तपाईंसँग कुनै चिन्ता छ भने निःसंकोच सोध्नुहोस्।',
      'mn': 'Сайн байна уу! Энэ бол 24/7 AI зөвлөгөө өгөх үйлчилгээ юм. Хэрэв танд ямар нэгэн асуудал байвал чөлөөтэй асуугаарай.'
    };
    return messages[language] || messages['ja'];
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading || !user) return;

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
      language: selectedLanguage
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await aiConsultationService.processConsultation({
        userId: user.id,
        message: inputMessage,
        language: selectedLanguage,
        sessionId
      });

      const assistantMessage: ChatMessage = {
        id: `assistant_${Date.now()}`,
        role: 'assistant',
        content: response.translatedResponse || response.response,
        timestamp: new Date(),
        language: selectedLanguage,
        urgency: response.urgency,
        suggestedActions: response.suggestedActions
      };

      setMessages(prev => [...prev, assistantMessage]);

      // 緊急時の特別処理
      if (response.urgency === 'critical') {
        const emergencyMessage: ChatMessage = {
          id: `emergency_${Date.now()}`,
          role: 'assistant',
          content: getEmergencyMessage(selectedLanguage),
          timestamp: new Date(),
          language: selectedLanguage,
          urgency: 'critical'
        };
        setMessages(prev => [...prev, emergencyMessage]);
      }

    } catch (error) {
      console.error('Consultation error:', error);
      const errorMessage: ChatMessage = {
        id: `error_${Date.now()}`,
        role: 'assistant',
        content: getErrorMessage(selectedLanguage),
        timestamp: new Date(),
        language: selectedLanguage
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const getEmergencyMessage = (language: string): string => {
    const messages: Record<string, string> = {
      'ja': '緊急事態を検出しました。すぐに人間のスタッフにお繋ぎします。緊急の場合は110番（警察）、119番（救急・消防）にお電話ください。',
      'en': 'Emergency detected. Connecting you to human staff immediately. For emergencies, call 110 (Police) or 119 (Ambulance/Fire).',
      'vi': 'Phát hiện tình huống khẩn cấp. Đang kết nối bạn với nhân viên ngay lập tức. Trong trường hợp khẩn cấp, hãy gọi 110 (Cảnh sát) hoặc 119 (Cứu thương/Cứu hỏa).'
    };
    return messages[language] || messages['ja'];
  };

  const getErrorMessage = (language: string): string => {
    const messages: Record<string, string> = {
      'ja': '申し訳ありませんが、一時的な問題が発生しました。しばらく待ってから再度お試しください。',
      'en': 'Sorry, there was a temporary issue. Please wait a moment and try again.',
      'vi': 'Xin lỗi, đã xảy ra sự cố tạm thời. Vui lòng đợi một chút và thử lại.'
    };
    return messages[language] || messages['ja'];
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getUrgencyColor = (urgency?: string) => {
    switch (urgency) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const handleStartRecording = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          const mediaRecorder = new MediaRecorder(stream);
          mediaRecorderRef.current = mediaRecorder;
          audioChunksRef.current = [];
          
          mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              audioChunksRef.current.push(event.data);
            }
          };
          
          mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
            
            // 録音停止表示
            setIsLoading(true);
            setIsRecording(false);
            
            try {
              // 音声認識処理
              const recognitionResult = await aiConsultationService.processSpeechInput(
                audioBlob, 
                selectedLanguage
              );
              
              if (recognitionResult.success && recognitionResult.text) {
                setInputMessage(recognitionResult.text);
              } else {
                alert('音声認識に失敗しました: ' + (recognitionResult.error || '不明なエラー'));
              }
            } catch (error) {
              console.error('Speech recognition error:', error);
              alert('音声認識処理中にエラーが発生しました');
            } finally {
              setIsLoading(false);
            }
            
            // ストリームの全トラックを停止
            stream.getTracks().forEach(track => track.stop());
          };
          
          // 録音開始
          mediaRecorder.start();
          setIsRecording(true);
          
          // 録音時間カウンター
          setRecordingTime(0);
          recordingTimerRef.current = window.setInterval(() => {
            setRecordingTime(prev => prev + 1);
          }, 1000);
          
          // 最大録音時間（30秒）
          setTimeout(() => {
            if (mediaRecorderRef.current?.state === 'recording') {
              handleStopRecording();
            }
          }, 30000);
          
        })
        .catch(error => {
          console.error('Media device error:', error);
          alert('マイクへのアクセスに失敗しました。ブラウザの設定を確認してください。');
        });
    } else {
      alert('お使いのブラウザは音声入力に対応していません。');
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
  };

  const formatRecordingTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-full max-h-screen bg-white rounded-lg shadow-lg">
      {/* ヘッダー */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <ComputerDesktopIcon className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">AI相談サービス</h3>
            <p className="text-sm text-gray-500">24時間対応・多言語サポート</p>
          </div>
        </div>

        {/* 言語選択 */}
        <div className="relative">
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {supportedLanguages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
          <LanguageIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* メッセージエリア */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-xs lg:max-w-md ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
              <div className="flex items-center space-x-2 mb-1">
                {message.role === 'assistant' ? (
                  <ComputerDesktopIcon className="w-4 h-4 text-blue-500" />
                ) : (
                  <UserIcon className="w-4 h-4 text-gray-500" />
                )}
                <span className="text-xs text-gray-500">
                  {message.role === 'assistant' ? 'AI Assistant' : 'あなた'}
                </span>
                <span className="text-xs text-gray-400">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
              
              <div
                className={`px-4 py-2 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : `bg-gray-100 text-gray-900 ${message.urgency ? getUrgencyColor(message.urgency) : ''}`
                }`}
              >
                {message.urgency === 'critical' && (
                  <div className="flex items-center mb-2">
                    <ExclamationTriangleIcon className="w-4 h-4 text-red-500 mr-1" />
                    <span className="text-xs font-semibold text-red-600">緊急</span>
                  </div>
                )}
                
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                
                {message.suggestedActions && message.suggestedActions.length > 0 && (
                  <div className="mt-3 space-y-1">
                    <p className="text-xs font-medium text-gray-600">推奨アクション:</p>
                    {message.suggestedActions.map((action, index) => (
                      <button
                        key={index}
                        className="block w-full text-left text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
                        onClick={() => setInputMessage(action)}
                      >
                        • {action}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg px-4 py-2">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-sm text-gray-600">AI が回答を生成中...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* 入力エリア */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-end space-x-2">
          <div className="flex-1">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`${selectedLanguage === 'ja' ? 'メッセージを入力...' : 'Type your message...'}`}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={2}
              disabled={isLoading || isRecording}
            />
            {isRecording && (
              <div className="mt-1 flex items-center">
                <div className="animate-pulse h-2 w-2 rounded-full bg-red-500 mr-2"></div>
                <span className="text-xs text-red-500">録音中... {formatRecordingTime(recordingTime)}</span>
              </div>
            )}
          </div>
          
          <div className="flex space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={isRecording ? handleStopRecording : handleStartRecording}
              className={isRecording ? 'bg-red-50 border-red-300' : ''}
              disabled={isLoading}
            >
              {isRecording ? (
                <StopIcon className="w-4 h-4 text-red-600" />
              ) : (
                <MicrophoneIcon className="w-4 h-4" />
              )}
            </Button>
            
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading || isRecording}
              size="sm"
            >
              <PaperAirplaneIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <p className="text-xs text-gray-500 mt-2">
          緊急時は110番（警察）、119番（救急・消防）にお電話ください
        </p>
      </div>
    </div>
  );
};