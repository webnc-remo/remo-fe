import { Icons } from '../../components/Icons';
import { getOauthGoogleUrl } from '../../utils/utils';

export const Login = () => {
  return (
    <div className="flex flex-col h-screen">
      <div className="content flex items-center justify-center flex-grow bg-main_bg bg-cover bg-center">
        <div>
          <div className="shadow-md flex justify-center p-10 mb:p-8 bg-gradient-to-r from-[#FCF5CA] to-[#FBFAF4] rounded-3xl flex-col items-center gap-6 mb:gap-4 w-[604px] mb:w-[300px]">
            <div className="font-bold text-3xl mb:text-2xl">Login</div>
            <div className="w-full flex items-center justify-center">
              <a
                href={getOauthGoogleUrl()}
                className="w-full flex items-center justify-center bg-white rounded-full shadow-md py-4 border-transparent border text-sm font-medium text-neutral-7 transition-all hover:text-tertiary-5  hover:border-tertiary-5 focus:border-transparent focus:text-neutral-7"
              >
                <Icons.GoogleIcon />
                <span className="text-xl mb:text-sm ml-4">
                  Continue with Google
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
