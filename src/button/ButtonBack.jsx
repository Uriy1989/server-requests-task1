import { useNavigate } from 'react-router-dom';

import styles from '../styles.module.css';

export const ButtonBack = () => {
	const navigate = useNavigate();

	const buttonBack = () => {
		navigate(-1);
	};

	return (
		<button onClick={() => buttonBack()} className={styles.todoButton}>
			Назад
		</button>
	);
};
