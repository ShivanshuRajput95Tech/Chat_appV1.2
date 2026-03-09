import React from "react";

const Features = () => {
  return (
    <section className="bg-zinc-900 text-white">
      <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
        <div className="max-w-screen-md mb-8 lg:mb-16">
          <h2 className="mb-4 text-4xl tracking-tight font-extrabold">
            Designed for business teams like yours
          </h2>
          <p className="sm:text-xl text-gray-400">
            Here at Swift we focus on markets where technology, innovation, and capital can unlock long-term value and drive economic growth.
          </p>
        </div>
        <div className="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-12 md:space-y-0">
          <div>
            <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12">
              <svg
                className="w-5 h-5 text-white lg:w-6 lg:h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 00-1.414 1.414L5.586 9H4V5a1 1 0 10-2 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-bold text-white">
              Marketing
            </h3>
            <p className="text-gray-400">
              Plan it, create it, launch it. Collaborate seamlessly on your next campaign or project with your team.
            </p>
          </div>
          <div>
            <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12">
              <svg
                className="w-5 h-5 text-white lg:w-6 lg:h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 001.15 1.64L6 6.769V9a1 1 0 102 0V6.769l2.244.891a1 1 0 001.15-1.64l-7-3zM14 9a1 1 0 012 0v3a1 1 0 01-1 1H9a1 1 0 01-1-1V9a1 1 0 112 0v3h4V9z" />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-bold text-white">
              Legal
            </h3>
            <p className="text-gray-400">
              Protect your organization, devices and stay compliant with our structured workflows and custom permissions made for you.
            </p>
          </div>
          <div>
            <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12">
              <svg
                className="w-5 h-5 text-white lg:w-6 lg:h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
                <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-bold text-white">
              Business Automation
            </h3>
            <p className="text-gray-400">
              Auto-assign tasks, send Slack messages, and much more. Now power up with hundreds of new templates to help you get started.
            </p>
          </div>
          <div>
            <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12">
              <svg
                className="w-5 h-5 text-white lg:w-6 lg:h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M8.433 7.418c.155-.103.346-.196.567-.26.22-.063.476-.094.76-.094.285 0 .54.031.76.094.221.064.412.157.567.26.156.102.294.246.414.432.12.186.18.412.18.676v2.096c0 .497-.1.94-.3 1.33-.2.39-.477.692-.83.906-.353.215-.747.32-1.18.32-.433 0-.827-.105-1.18-.32-.353-.214-.63-.516-.83-.906-.2-.39-.3-.833-.3-1.33V8.526c0-.264.06-.49.18-.676.12-.187.258-.33.414-.432z" />
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-bold text-white">
              Finance
            </h3>
            <p className="text-gray-400">
              Audit-proof software built for critical financial operations like month-end close and quarterly budgeting.
            </p>
          </div>
          <div>
            <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12">
              <svg
                className="w-5 h-5 text-white lg:w-6 lg:h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-bold text-white">
              Enterprise Design
            </h3>
            <p className="text-gray-400">
              Craft beautiful, delightful experiences for both marketing and product with real cross-company collaboration.
            </p>
          </div>
          <div>
            <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12">
              <svg
                className="w-5 h-5 text-white lg:w-6 lg:h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.947c-1.177-.489-2.44-.489-3.617 0a1.532 1.532 0 01-2.286-.947c-.378-1.56-2.6-1.56-2.978 0a1.532 1.532 0 01-2.286.947C.649 4.058.649 5.893 1.826 6.382a1.532 1.532 0 012.286.947c0 .556.227 1.059.553 1.425.326.366.774.553 1.244.553h.353c.596 0 1.17-.24 1.592-.659C9.334 9.713 10.667 9.713 11.743 9.648a2.914 2.914 0 011.945.467c.422.419.996.66 1.592.66h.353c.47 0 .918-.187 1.244-.553.326-.366.553-.869.553-1.425a1.532 1.532 0 012.286-.947c1.177.489 2.44.489 3.617 0a1.532 1.532 0 012.286-.947c.378 1.56 2.6 1.56 2.978 0a1.532 1.532 0 012.286.947c.489 1.177.489 2.44 0 3.617a1.532 1.532 0 01-2.286.947c-.556 0-1.059.227-1.425.553a2.082 2.082 0 01-1.244.553h-.353c-.596 0-1.17-.24-1.592-.66C14.666 10.287 13.333 10.287 12.257 10.352a2.914 2.914 0 01-1.945-.467 2.914 2.914 0 01-1.592-.66c-.422-.419-.996-.66-1.592-.66h-.353c-.47 0-.918.187-1.244.553a2.082 2.082 0 01-1.425.553 1.532 1.532 0 01-2.286-.947c-1.177-.489-2.44-.489-3.617 0a1.532 1.532 0 01-2.286.947c-.378-1.56-2.6-1.56-2.978 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-bold text-white">
              Operations
            </h3>
            <p className="text-gray-400">
              Keep your company's lights on with customizable, iterative, and structured workflows built for all efficient teams and individuals.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;