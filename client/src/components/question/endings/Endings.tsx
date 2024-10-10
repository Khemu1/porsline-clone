import { Dialog, DialogPanel } from "@headlessui/react";
import DefaultEnding from "./DefaultEnding";
import { useLanguage } from "../../lang/LanguageProvider";

const Endings = ({ isOpen, onClose }) => {
  const { t } = useLanguage();

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div
        className="fixed inset-0 bg-black bg-opacity-30"
        aria-hidden="true"
      />
      <div className="flex items-center gap-5 border-b border-b-gray-500 pb-2 px-2">
        <button type="button" onClick={onClose}>
          <img
            src="/assets/icons/close.svg"
            alt="Close"
            className="w-[20px] h-[20px]"
          />
        </button>
        <span className="text-lg main_text_bold">{t("welcomePage")}</span>
      </div>
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="bg-[#1e1e1e] rounded-md w-full h-full flex flex-col">
          <div className="flex items-center gap-5 border-b border-b-gray-500 pb-2 px-2">
            <button type="button" onClick={onClose}>
              <img
                src="/assets/icons/close.svg"
                alt="Close"
                className="w-[20px] h-[20px]"
              />
            </button>
            <span className="text-lg main_text_bold">{t("welcomePage")}</span>
          </div>
          <DefaultEnding onClose={onClose} />
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default Endings;
