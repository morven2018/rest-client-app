import Image, { StaticImageData } from 'next/image';
import alenaImage from '../../../../public/team-img/Alena.jpg';
import igorImage from '../../../../public/team-img/Igor.jpg';
import yuliaImage from '../../../../public/team-img/junior.jpg';
import { useTranslations } from 'next-intl';

interface TeamProps {
  nameKey: string;
  image: StaticImageData;
}

const Team = () => {
  const t = useTranslations('OurTeam');

  const teamMembers: TeamProps[] = [
    { nameKey: 'alena', image: alenaImage },
    { nameKey: 'igor', image: igorImage },
    { nameKey: 'yulia', image: yuliaImage },
  ];

  const memberName = (nameKey: string): string => t(`members.${nameKey}.name`);

  return (
    <div className="w-full bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 text-center mb-8">
        {t('title')}
      </h2>
      <div className="w-full mx-auto space-y-4">
        {teamMembers.map((member) => {
          const nameKey = member.nameKey;
          return (
            <div
              key={nameKey}
              className="max-w-[1440px] mx-auto flex flex-col md:flex-row bg-gradient-to-r from-[#8B8D98] to-[#FFFFFF] dark:bg-gradient-to-r dark:from-[#1C2024] dark:to-[#393c51]  rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="md:w-1/3 p-6 flex flex-col items-center justify-center">
                <div className="relative w-48 h-48 mb-4">
                  <Image
                    src={member.image}
                    alt={t(`members.${nameKey}.name`)}
                    fill
                    sizes="192px"
                    className="object-cover border-4 border-gray-200 dark:border-gray-700 rounded-[20px]"
                  />
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <a
                      href={t(`members.${nameKey}.githubUrl`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Visit ${memberName(nameKey)}'s GitHub profile`}
                      className="text-xl font-semibold text-white-600 dark:text-white-400 hover:underline"
                    >
                      {t(`members.${nameKey}.name`)}
                    </a>
                    <a
                      href={t(`members.${nameKey}.githubUrl`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.03 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                      </svg>
                    </a>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    {t(`members.${nameKey}.description`)}
                  </p>
                </div>
              </div>

              <div className="md:w-2/3 p-6 border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-700">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                    {t('about')}
                  </h3>
                  <div className="text-gray-600 dark:text-gray-300 text-sm space-y-2 text-left">
                    {t
                      .raw(`members.${nameKey}.bio`)
                      .map((line: string, i: number) => (
                        <p key={line + i}>{line}</p>
                      ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                    {t('contributions')}
                  </h3>
                  <ul className="text-gray-600 dark:text-gray-300 text-sm space-y-2">
                    {t
                      .raw(`members.${nameKey}.contributions`)
                      .map((contribution: string, i: number) => (
                        <li
                          key={contribution + i}
                          className="flex items-start text-left"
                        >
                          <span className="text-green-500 mr-2 mt-1">✓</span>
                          <span>{contribution}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Team;
