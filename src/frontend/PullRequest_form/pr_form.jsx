import React, { useEffect} from "react";
import { useSelector, useDispatch } from "react-redux";

import { ShowOrHidePRform } from "../../store/slices/pullrequestSlice";

import './pr_form.css';

const PullRequestForm = () => {
    const prf_status = useSelector((state) => state.PullRequestForm.isShown);
    const dispatch = useDispatch();
    useEffect(() =>{
        if (prf_status) {
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.body.style.overflow = '';
        }
    }, [prf_status]);
    if (prf_status){
        return (
            <div className='modal-overlay' onClick={() => dispatch(ShowOrHidePRform(prf_status ? false : true))}>
                <div className='modal-content' onClick={(e) => e.stopPropagation}>
                    <button className='modal-close' onClick={() => dispatch(ShowOrHidePRform(prf_status ? false : true))}>
                            x
                    </button>
                    <div>
                        <p className="mainn">Comming soon</p>
                    </div>
                </div>
            </div>
    );
    }
}

export default PullRequestForm;