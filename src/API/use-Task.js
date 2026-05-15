import { useState } from 'react';

export const useTask = () => {
	const [task, setTask] = useState(null);

	const handleSetTask = (value) => {
		setTask(value);
	};

	return { task, handleSetTask };
};
