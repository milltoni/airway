import React from 'react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { submitPullRequest, resetStatus, ShowOrHidePRform } from '../../../../store/slices/pullrequestSlice';
import './pr_form.css';

const modalStyle = {
    position: "fixed",
    zIndex: 1040,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
};

const backdropStyle = {
    ...modalStyle,
    backgroundColor: "#000",
    opacity: 0.5,
    zIndex: 1040
};

const dialogStyle = {
    position: "relative",
    width: 400,
    maxWidth: "90%",
    backgroundColor: "white",
    boxShadow: "0 5px 15px rgba(0,0,0,.5)",
    padding: 20,
    zIndex: 1050,
    borderRadius: 4
};

const PullRequestForm = () => {
    const yamlString = useSelector((state) => state.data.yamlString);
    const errors = useSelector((state) => state.data.errors);
    const isShown = useSelector((state) => state.pullRequestForm.isShown);
    const dispatch = useDispatch();
    const { isLoading, pushResult, prResult, error } = useSelector(
        (state) => state.pullRequestForm
    );

    const [formData, setFormData] = React.useState({
        username: '',
        password: '',
        title: '',
        commit_msg: '',
        body: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { username, password, title, commit_msg, body } = formData;
        dispatch(
            submitPullRequest({
                credentials: { username, password },
                yamlString,
                prOptions: { title, body, commit_msg },
            })
        );
    };

    const handleClose = () => {
        dispatch(resetStatus());
        dispatch(ShowOrHidePRform(false));
    };

    const textInput = (name, placeholder) => (
        <input
            placeholder={placeholder}
            name={name}
            type={name === 'password' ? 'password' : 'text'}
            value={formData[name]}
            onChange={handleInputChange}
            disabled={isLoading}
        />
    );

    // Если модальное окно не должно показываться, ничего не рендерим
    if (!isShown) return null;

    // Содержимое в зависимости от состояния
    let content;
    if (pushResult || prResult) {
        content = (
            <div>
                <p>Push result: {pushResult}</p>
                <p>PR created: {prResult}</p>
                {error && <p style={{ color: 'red' }}>Error: {error}</p>}
                <button onClick={handleClose}>Close</button>
            </div>
        );
    } else if (errors.length > 0) {
        content = <div>Please, resolve errors before making a PR.</div>;
    } else {
        content = (
            <div className="pull_request_form">
                <h3 id="modal-label">Create Pull Request</h3>
                <form onSubmit={handleSubmit}>
                    {textInput('username', 'username')}
                    <br />
                    {textInput('password', 'password')}
                    <br />
                    {textInput('commit_msg', 'commit message')}
                    <br />
                    {textInput('title', 'PR title')}
                    <br />
                    {textInput('body', 'PR body')}
                    <br />
                    <input type="submit" value="Submit" disabled={isLoading} />
                    {isLoading && <span> ⏳ Processing...</span>}
                </form>
            </div>
        );
    }

    return createPortal(
        <div style={modalStyle}>
            {/* Оверлей, клик по которому закрывает окно */}
            <div style={backdropStyle} onClick={handleClose} />
            {/* Само модальное окно, клики по нему не всплывают к оверлею */}
            <div style={dialogStyle} onClick={(e) => e.stopPropagation()}>
                {content}
            </div>
        </div>,
        document.body
    );
};

export default PullRequestForm;