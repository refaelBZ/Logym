import Button from "../Button";
import styles from "./style.module.scss";

export default function DialogBox({ questionText, onConfirm, onCancel, confirmText = "Yes", cancelText = "No" }) {
    return (
        <div
            className={styles.dialogBox}
            onClick={e => e.stopPropagation()}
            role="alertdialog"
            aria-modal="true"
            aria-describedby="dialog-question"
        >
            <div className={styles.question} id="dialog-question">
                {questionText}?
            </div>
            <div className={styles.buttons}>
                <Button title={cancelText} type="secondary" onClick={onCancel} />
                <Button title={confirmText} type="primary" onClick={onConfirm} />
            </div>
        </div>
    );
}
