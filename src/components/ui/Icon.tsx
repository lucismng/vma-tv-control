import React from 'react';

interface IconProps {
  name: string;
  className?: string;
}

export const Icon: React.FC<IconProps> = ({ name, className = 'w-6 h-6' }) => {
  const icons: { [key: string]: React.ReactNode } = {
    plus: <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />,
    trash: <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />,
    edit: <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />,
    upload: <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />,
    download: <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />,
    tv: <path strokeLinecap="round" strokeLinejoin="round" d="M6 20.25h12m-7.5-3.75v3.75m-3.75 0h15M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 0 1 3-3h.008c1.657 0 3.002 1.343 3.002 3v8.25a3 3 0 0 1-3 3h-.008Zm-3.75 0a3.75 3.75 0 0 1-3.75-3.75V8.25a3.75 3.75 0 0 1 3.75-3.75h.008v11.25h-.008Zm8.25-3.75a3.75 3.75 0 0 0 3.75-3.75V8.25a3.75 3.75 0 0 0-3.75-3.75h-.008v11.25h.008Z" />,
    'calendar-days': <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3.75 8.25h16.5M18.75 12h.008v.008h-.008V12Zm-3.75 0h.008v.008h-.008V12Zm-3.75 0h.008v.008h-.008V12Zm-3.75 0h.008v.008h-.008V12Zm-3.75 0h.008v.008h-.008V12Zm3.75 3.75h.008v.008h-.008v-.008Zm3.75 0h.008v.008h-.008v-.008Zm3.75 0h.008v.008h-.008v-.008Zm3.75 0h.008v.008h-.008v-.008Z M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18.75Z" />,
    close: <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />,
    spinner: <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.75m0 12.5V21M4.93 4.93l1.98 1.98m8.14 8.14 1.98 1.98M3 12h2.75m12.5 0H21m-4.93 15.07-1.98-1.98M7.91 7.91 5.93 5.93" />,
    check: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />,
    error: <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />,
    folder: <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.75h16.5m-16.5 0A2.25 2.25 0 0 1 6 7.5h12a2.25 2.25 0 0 1 2.25 2.25m-16.5 0v6.75a2.25 2.25 0 0 0 2.25 2.25h12a2.25 2.25 0 0 0 2.25-2.25v-6.75" />,
    menu: <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />,
    play: <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />,
    'folder-cog': <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.75h16.5m-16.5 0A2.25 2.25 0 0 1 6 7.5h12a2.25 2.25 0 0 1 2.25 2.25m-16.5 0v6.75a2.25 2.25 0 0 0 2.25 2.25h12a2.25 2.25 0 0 0 2.25-2.25v-6.75m-16.5-1.5a1.5 1.5 0 0 1-1.5-1.5v-1.5a1.5 1.5 0 0 1 1.5-1.5H15a1.5 1.5 0 0 1 1.5 1.5v1.5a1.5 1.5 0 0 1-1.5 1.5m-6.75-2.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM13.5 18.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" />,
    search: <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />,
    link: <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />,
    cog: <><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.26.713.53.967l.82-1.036c.453-.572 1.244-.68 1.846-.235l1.294.935c.602.444.71 1.243.235 1.846l-1.036.82c-.257.27-.6.467-.967.53l-1.281.213c-.542.09-.94.56-.94 1.11v2.594c0 .55.398 1.02.94 1.11l1.281.213c.374.063.713.26.967.53l1.036.82c.572.453.68 1.244.235 1.846l-.935 1.294c-.444.602-1.243.71-1.846-.235l-.82-1.036c-.27-.257-.467-.6-.53-.967l-.213-1.281c-.09-.542-.56-.94-1.11-.94h-2.593c-.55 0-1.02.398-1.11.94l-.213 1.281c-.063.374-.26.713-.53.967l-.82 1.036c-.453-.572-1.244-.68-1.846-.235l-1.294-.935c-.602-.444-.71-1.243-.235-1.846l1.036-.82c.257-.27.6-.467.967.53l1.281-.213c.542-.09.94-.56.94-1.11v-2.594c0-.55-.398-1.02-.94-1.11l-1.281-.213c-.374-.063-.713-.26-.967-.53l-1.036-.82c-.572-.453-.68-1.244-.235-1.846l.935-1.294c.444-.602 1.243-.71 1.846-.235l.82 1.036c.27.257.467-.6.53.967l.213 1.281Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></>,
    refresh: <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 11.664 0l3.181-3.183m-4.991-2.69-3.182-3.182a8.25 8.25 0 0 0-11.664 0l-3.181 3.182" />,
    'view-grid': <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25v2.25A2.25 2.25 0 0 1 8.25 21H6a2.25 2.25 0 0 1-2.25-2.25v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25v2.25a2.25 2.25 0 0 1-2.25 2.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z" />,
    'list-bullet': <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM3.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM3.75 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />,
    'cloud-arrow-up': <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M15 9.75V10.5a3.75 3.75 0 0 1-7.5 0V9.75a4.5 4.5 0 0 1 1.83-3.665L12 3l1.17 2.085A4.5 4.5 0 0 1 15 9.75Z" />,
    'drag-handle': <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5zm0 6a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5zm0 6a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5z" />,
  };

  const spinnerClass = name === 'spinner' ? 'animate-spin' : '';

  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`${className} ${spinnerClass}`}>
      {icons[name] || null}
    </svg>
  );
};