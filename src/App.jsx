import './App.css';
import styles from './styles.module.css';
import { TodoList } from './pages/TodoList.jsx';
import { Task } from './pages/Task.jsx';
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { NotFound } from './pages/NotFound.jsx';
//npx json-server --watch --port 3003 db.json

function App() {
	return (
		<>
			<div className={styles.H3}>
				<h3>Менеджер задач</h3>
			</div>
			<div className={styles.block}></div>
			<Routes>
				<Route path="/" element={<TodoList />} />
				<Route path="task/:id" element={<Task />} />
				<Route path="/404" element={<NotFound />} />
				<Route path="*" element={<NotFound />} />
			</Routes>
		</>
	);
}

export default App;
