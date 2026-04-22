import "./ErrorField.css";

const Error = ({ line, message, scope, onClick }) => {

    const handleClick = () => {
        onClick(line);
    };

    return(
      <div className = "errors__body" >
            <a
                href="#"
                onClick={e => {
                    e.preventDefault();
                    handleClick();
                }}
            >
                Line {line}
            </a>: { message }
      </div >
    );
  }

export default Error;