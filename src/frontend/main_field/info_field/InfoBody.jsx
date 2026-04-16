import "./InfoBody.css";

const InfoWidget = ({ base, body }) => {
    return (
        <div className="info_widget">
            {base ? <div className="info_widget__header"> {base}</div> : null}
            <div className="info_widget__body">
                {body}
            </div>
        </div>
    );
}

export default InfoWidget;