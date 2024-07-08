import React from "react";
import { FaArrowLeft } from "react-icons/fa";

type propTypes = {
    settingsOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Modal: React.FC<propTypes> = ({settingsOpen, onClose, children}) => {
    return (
        <div className="fixed inset-5 mt-3 transition-all "
        onClick={onClose}
        >
            <div className={'bg-zinc-700 rounded-xl drop-shadow-xl p-10 transition-all'}
            onClick={(e) => e.stopPropagation()}>

                <div className="absolute top-0 left-0 rounded-md bg-gradient-to-r from-zinc-800 from-70% to-stone-700 min-w-full">
                    <div className="flex flex-row m-2">
                        <button className="py-1 px-2 border rounded-md text-gray-400 bg-white"
                        onClick={onClose}>
                            <FaArrowLeft />
                        </button>
                        <p className="ms-2 mt-1 font-poppins font-thin text-sm">Settings</p>
                    </div>
                </div>

                
                {children}
            </div>
        </div>
    )
};



export default Modal;