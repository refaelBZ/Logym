import Button from "../Button";
import styles from "./style.module.scss";

export default function DialogBox({questionText, onConfirm, onCancel}) {
    return (
        <div className={styles.dialogBox} onClick={e => e.stopPropagation()}>
<div className={styles.question}>
{questionText}?

    </div>                <div className={styles.buttons}>
                <Button title="No" type="secondary" onClick={onCancel} />
                <Button title="Yes" type="primary" onClick={onConfirm} />
                </div>
        </div>
    );
}