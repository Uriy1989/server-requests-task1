import { useState } from 'react';
import { ref, remove } from 'firebase/database';
import { db } from '../firebase';

export const useRequestDeleteTodo = () => {
	const [isDelete, setIsDelete] = useState(false);

	const requestDeleteTodo = (id) => {
		const todoDbRef = ref(db, `todoList/${id}`);

		remove(todoDbRef)
			.then((response) => {
				console.log(
					'Задача удалена c id:' + id + ', ответ сервера:',
					response,
				);
			})
			.finally(() => setIsDelete(false));
	};
	return { isDelete, requestDeleteTodo };
};
