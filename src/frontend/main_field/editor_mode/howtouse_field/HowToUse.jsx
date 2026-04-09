import React, { useEffect} from "react";
import { useSelector, useDispatch } from "react-redux";

import { ShowOrHideAddInfo } from '../../../../store/slices/add_infoSlice';

import './HowToUse.css';

const HowToAdd = () => {
    const add_info = useSelector((state) => state.add_info.isShown);
    const dispatch = useDispatch();
    useEffect(() =>{
        if (add_info) {
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.body.style.overflow = '';
        }
    }, [add_info]);
    if (add_info){
        return (
            <div className='modal-overlay' onClick={() => dispatch(ShowOrHideAddInfo(add_info ? false : true))}>
                <div className='modal-content' onClick={(e) => e.stopPropagation}>
                    <button className='modal-close' onClick={() => dispatch(ShowOrHideAddInfo(add_info ? false : true))}>
                            x
                    </button>
                    <div>
                        <p className="mainn">We will soon post a complete guide here, 
                            in which you will find a description of the editor's main functions, 
                            a list of hotkeys for convenient work, 
                            a data schema with its explanation, 
                            as well as instructions on how to submit a request to have your materials appear on this resource.</p>
                    </div>
                </div>
            </div>
    );
    }
}

export default HowToAdd;