const ShareSurvey = () => {
  return (
    <div className="flex gap-2 items-center">
      <button className="w-[30px] h-[30px]">
        <img src="/assets/icons/socials/facebook.svg" alt="facebook" />
      </button>
      <button className="w-[30px] h-[30px]">
        <img src="/assets/icons/socials/linkedin.svg" alt="linkedin" />
      </button>
      <button className="w-[30px] h-[30px]">
        <img src="/assets/icons/socials/telegram.svg" alt="telegram" />
      </button>
      <button className="w-[30px] h-[30px] bg-blue-500 p-1 rounded-md">
        <img src="/assets/icons/socials/twitter.svg" alt="twitter" />
      </button>
      <button className="w-[30px] h-[30px] bg-green-600 p-1 rounded-md">
        <img src="/assets/icons/socials/whats-app.svg" alt="whats-app" />
      </button>
    </div>
  );
};

export default ShareSurvey;
