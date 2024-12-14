export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9'),
	() => import('./nodes/10'),
	() => import('./nodes/11'),
	() => import('./nodes/12'),
	() => import('./nodes/13'),
	() => import('./nodes/14'),
	() => import('./nodes/15'),
	() => import('./nodes/16')
];

export const server_loads = [];

export const dictionary = {
		"/": [3],
		"/admin": [4,[2]],
		"/admin/auth": [5,[2]],
		"/admin/category": [6,[2]],
		"/admin/dashboard": [7,[2]],
		"/admin/user": [8,[2]],
		"/dashboard": [9],
		"/join": [10],
		"/login": [11],
		"/mypage": [12],
		"/products": [~13],
		"/products/create": [~15],
		"/products/edit/[id]": [~16],
		"/products/[id]": [~14]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),

	reroute: (() => {})
};

export { default as root } from '../root.js';