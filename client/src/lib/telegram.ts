declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        close: () => void;
        MainButton: {
          text: string;
          color: string;
          textColor: string;
          isVisible: boolean;
          isActive: boolean;
          isProgressVisible: boolean;
          setText: (text: string) => void;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
          show: () => void;
          hide: () => void;
          enable: () => void;
          disable: () => void;
          showProgress: (leaveActive?: boolean) => void;
          hideProgress: () => void;
        };
        BackButton: {
          isVisible: boolean;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
          show: () => void;
          hide: () => void;
        };
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
          };
          query_id?: string;
        };
        themeParams: {
          bg_color?: string;
          text_color?: string;
          hint_color?: string;
          link_color?: string;
          button_color?: string;
          button_text_color?: string;
          secondary_bg_color?: string;
        };
        colorScheme: 'light' | 'dark';
        platform: string;
        sendData: (data: string) => void;
      };
    };
  }
}

export const useTelegram = () => {
  const tg = window.Telegram?.WebApp;

  const onClose = () => {
    tg?.close();
  };

  const onToggleMainButton = () => {
    if (tg?.MainButton.isVisible) {
      tg?.MainButton.hide();
    } else {
      tg?.MainButton.show();
    }
  };

  return {
    tg,
    user: tg?.initDataUnsafe?.user,
    onClose,
    onToggleMainButton,
    colorScheme: tg?.colorScheme || 'light',
    themeParams: tg?.themeParams || {},
  };
};

export const initTelegramApp = () => {
  const tg = window.Telegram?.WebApp;
  if (tg) {
    tg.ready();
    tg.expand();
  }
};
