import { useState } from 'react';
import { ref, set } from 'firebase/database';
import { db } from '../firebase';

export const useRequestUpdateTodo = (todoList) => {
	const [isUpdating, setIsUpdating] = useState(false);

	const requestUpdateTodo = (id, updates = {}) => {
		setIsUpdating(true);

		const todoDbRef = ref(db, `todoList/${id}`);

		const currentTodo = todoList[id];

		if (!currentTodo) {
			console.error('Todo не найден');
			setIsUpdating(false);
			return;
		}

		const updatedTodo = {
			...currentTodo,
			...updates,
		};

		set(todoDbRef, updatedTodo)
			.then((response) => {
				console.log(response);
			})
			.finally(() => setIsUpdating(false));
	};

	return { isUpdating, requestUpdateTodo };
};
