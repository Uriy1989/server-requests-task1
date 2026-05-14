import styles from '../styles.module.css';

import { ButtonBack } from '../button/ButtonBack.jsx';

export const NotFound = () => {
	return (
		<div>
			<div className={styles.wrapper}>Страница не найдена</div>
			<ButtonBack />
		</div>
	);
};
