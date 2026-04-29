import { useState } from 'react';
import { ref, push } from 'firebase/database';
import { db } from '../firebase';

export const useRequestAddTodo = (searchPhrase) => {
	const [isCreating, setIsCreating] = useState(true);

	const handleIsCreating = (value) => {
		setIsCreating(value);
	};

	const requestAddTodo = () => {
		setIsCreating(true);

		const todoListDbRef = ref(db, 'todoList');

		push(todoListDbRef, {
			title: searchPhrase,
			userId: 1,
			completed: false,
		})
			.then((response) => {
				console.log('задача добавлена, ответ сервера:', response);
			})
			.finally();
	};

	return { isCreating, requestAddTodo, handleIsCreating };
};
