import React from 'react';
import yuliaImage from '../../../public/team-img/junior.jpg';
import igorImage from '../../../public/team-img/Igor.jpg';
import alenaImage from '../../../public/team-img/Alena.jpg';
import Image, { StaticImageData } from 'next/image';

interface TeamMember {
  name: string;
  image: StaticImageData;
  description: string;
  bio: string[];
  contributions: string[];
  gitHubUrl: string;
}

const TeamMembers = () => {
  const teamMembers: TeamMember[] = [
    {
      name: 'Alena Pudina',
      image: alenaImage,
      description: 'Team Lead | UI/UX Design | Frontend Development',
      bio: [
        'Math & Computer Science Genius.',
        "Skilled Programmer with a Master's Degree in Applied Mathematics and Computer Science.",
        'Excelled in Physics and Chemistry Olympiads during her School Years.',
        'Experience as a Project Manager.',
      ],
      contributions: [
        'Led UI/UX design implementation in Figma.',
        'Established Project folder structure and Layout Architecture.',
        'Implemented Header component and Registration Module.',
        'Configured dynamic Routing for auto-generated pages.',
        'Developed User Profile page with interactive functionality.',
        'Built shopping Cart Page with order processing functionality.',
        'Created robust Validation System for form inputs and user data.',
        'Fixed SonarQube code quality issues and integrated mentors suggestions to optimize performance.',
        'Conducted code reviews to foster successful collaboration among developers, significantly enhancing code quality by identifying and resolving issues.',
      ],
      gitHubUrl: 'https://github.com/morven2018',
    },
    {
      name: 'Igor Batura',
      image: igorImage,
      description: 'Senior Fullstack Developer',
      bio: [
        'Natural-Born Leader with a Vision for Technical Innovation.',
        'Extremely Talented & Skilled Fullstack Developer with a Strong Work Ethic.',
        'Resilient, Disciplined & Goal-oriented.',
        'Collaborative Team Player Who Elevates Those Around Him and Amplifies Collective Success.',
      ],
      contributions: [
        'Partnered with the Team Lead on architectural decisions and task delegation.',
        'Architected and configured all project configuration files.',
        'Designed and implemented Backend infrastructure with secure API endpoints and database connectivity.',
        'Developed product Catalog Page with dynamic filtering, sorting, and pagination functionality.',
        'Engineered secure login Authentication system with form validation and error handling.',
        'Fixed SonarQube code quality issues and integrated mentors suggestions to optimize performance.',
        'Implemented a Router for page navigation and redirecting authorized/unauthorized users based on manual browser URL changes.',
        'Reviewed Junior Developer code, providing constructive feedback and mentorship.',
      ],
      gitHubUrl: 'https://github.com/Ihar-Batura',
    },
    {
      name: 'Yulia Podgurskaia',
      image: yuliaImage,
      description:
        'Project Manager | English Translation | Automated Testing | Frontend Development',
      bio: [
        'Trilingual Frontend Developer: English, Chinese, Russian.',
        'Excelled in Math, Chemistry, Russian, English Olympiads and Music Competitions.',
        'Received a Medal for Academic Excellence. Graduated with Two Diplomas with Honors.',
        'Pianist, Dancer & Athlete.',
      ],
      contributions: [
        'Collaborated on UI/UX design system implementation.',
        'Built several sections, pages and components (Promo Code, About Page, Besteseller, Popular, Strengths, Card Component, Footer).',
        'Orchestrated sprint planning via Trello task tracking and executed production deployments.',
        'Configured Commerce Tools platform, optimizing product catalog management.',
        'Established comprehensive testing suite with 30%+ coverage using Jest, Vitest, and React Testing Library.',
        'Conducted manual testing on multiple browsers and devices for reliability.',
        'Refactored Codebase, fixed SonarQube issues, integrated mentors code review suggestions.',
        'Conducted code reviews to promote effective team collaboration and improve code quality.',
      ],
      gitHubUrl: 'https://github.com/yuliafire',
    },
  ];

  const handleGitHubClick = (url: string, event: React.MouseEvent) => {
    event.stopPropagation();
    window.open(url, '_blank', 'noopener, noreferrer');
  };

  return (
    <div className="w-full bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 text-center mb-8">
        Our Team
      </h2>
      <div className="w-full mx-auto space-y-4">
        {teamMembers.map((member, index) => (
          <div
            key={index}
            className="max-w-[1440px] mx-auto flex flex-col md:flex-row bg-gradient-to-r from-[#1C2024] to-[#8B8D98] rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className="md:w-1/3 p-6 flex flex-col items-center justify-center">
              <div className="relative w-48 h-48 mb-4">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover border-4 border-gray-200 dark:border-gray-700 rounded-[20px]"
                />
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <a
                    href={member.gitHubUrl}
                    onClick={(e) => handleGitHubClick(member.gitHubUrl, e)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit ${member.name}'s GitHub profile`}
                    className="text-xl font-semibold text-white-600 dark:text-white-400 hover:underline"
                  >
                    {member.name}
                  </a>
                  <a
                    href={member.gitHubUrl}
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
                  {member.description}
                </p>
              </div>
            </div>

            <div className="md:w-2/3 p-6 border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-700">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  About
                </h3>
                <div className="text-gray-600 dark:text-gray-300 text-sm space-y-2 text-left">
                  {member.bio.map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  Contributions
                </h3>
                <ul className="text-gray-600 dark:text-gray-300 text-sm space-y-2">
                  {member.contributions.map((contribution, i) => (
                    <li key={i} className="flex items-start text-left">
                      <span className="text-green-500 mr-2 mt-1">✓</span>
                      <span>{contribution}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamMembers;
