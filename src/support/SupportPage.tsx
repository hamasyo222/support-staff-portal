import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  ChatBubbleLeftRightIcon,
  CalendarDaysIcon,
  MapPinIcon,
  HeartIcon,
  PhoneIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { AIConsultationChat } from '../../components/support/AIConsultationChat';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../stores/authStore';

export const SupportPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'session' | 'recommendations' | 'emergency'>('chat');
  const { user } = useAuthStore();
  const { t } = useTranslation();

  const tabs = [
    {
      id: 'chat' as const,
      name: 'AI相談',
      icon: ChatBubbleLeftRightIcon,
      description: '24時間対応のAI相談サービス'
    },
    {
      id: 'session' as const,
      name: '面談予約',
      icon: CalendarDaysIcon,
      description: '母国語スタッフとの面談予約'
    },
    {
      id: 'recommendations' as const,
      name: 'おすすめ情報',
      icon: MapPinIcon,
      description: 'あなたに合った生活情報'
    },
    {
      id: 'emergency' as const,
      name: '緊急時対応',
      icon: ExclamationTriangleIcon,
      description: '緊急時の連絡先・対応方法'
    }
  ];

  const emergencyContacts = [
    {
      name: '警察',
      number: '110',
      description: '事件・事故・犯罪に関する緊急時',
      color: 'bg-blue-500'
    },
    {
      name: '救急・消防',
      number: '119',
      description: '火事・救急医療が必要な時',
      color: 'bg-red-500'
    },
    {
      name: '外国人在留総合インフォメーションセンター',
      number: '0570-013904',
      description: '在留手続きに関する相談',
      color: 'bg-green-500'
    },
    {
      name: 'DX Seed 緊急サポート',
      number: '0120-XXX-XXX',
      description: '24時間対応の緊急サポート',
      color: 'bg-purple-500'
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'chat':
        return (
          <div className="h-[600px]">
            <AIConsultationChat />
          </div>
        );

      case 'session':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <CalendarDaysIcon className="mx-auto h-12 w-12 text-blue-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                母国語スタッフとの面談予約
              </h3>
              <p className="text-gray-600 mb-6">
                あなたの母国語を話すスタッフとオンラインで面談できます
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">一般相談</h4>
                <p className="text-sm text-gray-600 mb-3">
                  生活・仕事・手続きに関する一般的な相談
                </p>
                <p className="text-xs text-gray-500 mb-3">
                  所要時間: 30-60分 | 料金: 無料
                </p>
                <Button size="sm" className="w-full">
                  予約する
                </Button>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">緊急相談</h4>
                <p className="text-sm text-gray-600 mb-3">
                  緊急性の高い問題に関する相談
                </p>
                <p className="text-xs text-gray-500 mb-3">
                  所要時間: 15-30分 | 料金: 無料
                </p>
                <Button size="sm" variant="outline" className="w-full">
                  緊急予約
                </Button>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">対応言語</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-blue-800">
                <div>🇻🇳 ベトナム語</div>
                <div>🇨🇳 中国語</div>
                <div>🇵🇭 フィリピン語</div>
                <div>🇮🇩 インドネシア語</div>
                <div>🇹🇭 タイ語</div>
                <div>🇲🇲 ミャンマー語</div>
                <div>🇰🇭 カンボジア語</div>
                <div>🇳🇵 ネパール語</div>
              </div>
            </div>
          </div>
        );

      case 'recommendations':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <MapPinIcon className="mx-auto h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                あなたにおすすめの情報
              </h3>
              <p className="text-gray-600 mb-6">
                あなたの文化・宗教・好みに合わせた生活情報をお届けします
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    🍽️
                  </div>
                  <h4 className="font-medium text-gray-900">ハラル対応レストラン</h4>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  あなたの近くのハラル認証レストラン
                </p>
                <Button size="sm" variant="outline" className="w-full">
                  詳細を見る
                </Button>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    🏪
                  </div>
                  <h4 className="font-medium text-gray-900">アジア食材店</h4>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  母国の食材が買える店舗情報
                </p>
                <Button size="sm" variant="outline" className="w-full">
                  詳細を見る
                </Button>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    🕌
                  </div>
                  <h4 className="font-medium text-gray-900">宗教施設</h4>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  近くの礼拝施設・宗教コミュニティ
                </p>
                <Button size="sm" variant="outline" className="w-full">
                  詳細を見る
                </Button>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                    🏥
                  </div>
                  <h4 className="font-medium text-gray-900">多言語対応病院</h4>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  外国語対応可能な医療機関
                </p>
                <Button size="sm" variant="outline" className="w-full">
                  詳細を見る
                </Button>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                    🎉
                  </div>
                  <h4 className="font-medium text-gray-900">文化イベント</h4>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  母国の文化イベント・お祭り情報
                </p>
                <Button size="sm" variant="outline" className="w-full">
                  詳細を見る
                </Button>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                    👥
                  </div>
                  <h4 className="font-medium text-gray-900">コミュニティ</h4>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  同国人コミュニティ・交流会
                </p>
                <Button size="sm" variant="outline" className="w-full">
                  詳細を見る
                </Button>
              </div>
            </div>
          </div>
        );

      case 'emergency':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                緊急時の連絡先
              </h3>
              <p className="text-gray-600 mb-6">
                緊急時は迷わずに適切な連絡先に電話してください
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {emergencyContacts.map((contact, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center mb-3">
                    <div className={`w-10 h-10 ${contact.color} rounded-full flex items-center justify-center mr-3`}>
                      <PhoneIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{contact.name}</h4>
                      <p className="text-2xl font-bold text-gray-900">{contact.number}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{contact.description}</p>
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={() => window.open(`tel:${contact.number}`)}
                  >
                    電話をかける
                  </Button>
                </div>
              ))}
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-semibold text-red-900 mb-2">緊急時の基本対応</h4>
              <ul className="text-sm text-red-800 space-y-1">
                <li>• まず安全な場所に避難してください</li>
                <li>• 落ち着いて状況を確認してください</li>
                <li>• 必要に応じて上記の緊急連絡先に電話してください</li>
                <li>• 日本語が話せない場合は「外国人です」と最初に伝えてください</li>
                <li>• 住所・名前・電話番号を準備しておいてください</li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">多言語対応</h4>
              <p className="text-sm text-blue-800">
                警察・消防・救急では多言語通訳サービスが利用できます。
                「English please」「Vietnamese please」など、希望する言語を伝えてください。
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">生活支援サービス</h1>
        <p className="text-gray-600">24時間対応の多言語サポートサービス</p>
      </div>

      {/* ユーザー情報表示 */}
      {user && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
          <div className="flex items-center">
            <HeartIcon className="h-6 w-6 text-blue-500 mr-3" />
            <div>
              <p className="font-medium text-gray-900">
                {user.firstName}さん、こんにちは
              </p>
              <p className="text-sm text-gray-600">
                あなたの文化・言語に配慮したサポートを提供します
              </p>
            </div>
          </div>
        </div>
      )}

      {/* タブナビゲーション */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Icon className="w-5 h-5" />
                  <span>{tab.name}</span>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* タブコンテンツ */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {renderTabContent()}
      </div>
    </div>
  );
};